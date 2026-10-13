import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { ResumeData, DEFAULT_PHOTO } from '../types/resume';

// Arquivos locais de dados (ignorados pelo Git via .gitignore)
const DATA_DIR = path.join(process.cwd(), 'data');
const SQLITE_FILE = path.join(DATA_DIR, 'resume.db');
const LEGACY_JSON_FILE = path.join(process.cwd(), 'database.json');


export interface User {
  id: string;
  email: string;
  passwordHash: string;
  isAdmin: boolean;
}

export interface ResumeRecord {
  userId: string;
  resume: ResumeData;
}

interface LegacySchema {
  users: User[];
  resumes: ResumeRecord[];
}

interface UserRow {
  id: string;
  email: string;
  password_hash: string;
  is_admin: number;
}

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

// Currículo em branco para contas novas (sem nenhum dado pessoal)
export const emptyResumeData = (): ResumeData => ({
  header: { photo: DEFAULT_PHOTO, name: '', email: '', currentRole: '' },
  personal: { age: 0, gender: '', lastUpdated: '', neighborhood: '', cityState: '', phone: '' },
  goals: { targetRoles: [], salaryMin: '', salaryDesired: '', period: '', hideSalaryOnPDF: false },
  summary: '',
  education: [],
  courses: [],
  experiences: [],
  languages: [],
  skills: [],
  template: 'classic',
  templateLanguage: 'pt',
});

const rowToUser = (row: UserRow): User => ({
  id: row.id,
  email: row.email,
  passwordHash: row.password_hash,
  isAdmin: row.is_admin === 1,
});

class SQLiteDatabase {
  private conn: Database.Database | null = null;

  private get db(): Database.Database {
    if (this.conn) return this.conn;

    fs.mkdirSync(DATA_DIR, { recursive: true });
    const conn = new Database(SQLITE_FILE);
    conn.pragma('journal_mode = WAL');
    conn.pragma('foreign_keys = ON');

    conn.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        email TEXT UNIQUE NOT NULL COLLATE NOCASE,
        password_hash TEXT NOT NULL,
        is_admin INTEGER NOT NULL DEFAULT 0,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS resumes (
        user_id TEXT PRIMARY KEY,
        data TEXT NOT NULL,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    this.conn = conn;
    this.seed(conn);
    return conn;
  }

  // Popula o banco apenas na primeira execução (banco vazio)
  private seed(conn: Database.Database) {
    const { count } = conn.prepare('SELECT COUNT(*) AS count FROM users').get() as { count: number };
    if (count > 0) return;

    const insertUser = conn.prepare(
      'INSERT INTO users (id, email, password_hash, is_admin) VALUES (?, ?, ?, ?)'
    );
    const insertResume = conn.prepare('INSERT INTO resumes (user_id, data) VALUES (?, ?)');

    // Migração única: importa o database.json legado, se existir localmente
    if (fs.existsSync(LEGACY_JSON_FILE)) {
      try {
        const legacy = JSON.parse(fs.readFileSync(LEGACY_JSON_FILE, 'utf-8')) as LegacySchema;
        const migrate = conn.transaction(() => {
          for (const u of legacy.users) {
            insertUser.run(u.id, u.email, u.passwordHash, u.isAdmin ? 1 : 0);
          }
          for (const r of legacy.resumes) {
            const resume: ResumeData = {
              ...r.resume,
              template: r.resume.template || 'classic',
              templateLanguage: r.resume.templateLanguage || 'pt',
            };
            insertResume.run(r.userId, JSON.stringify(resume));
          }
        });
        migrate();
        if (legacy.users.length > 0) return;
      } catch (err) {
        console.error('Falha ao migrar database.json para SQLite:', err);
      }
    }

    // Banco novo: conta admin com currículo em branco
    const seedAdmin = conn.transaction(() => {
      insertUser.run('user-admin', 'admin', hashPassword('admin'), 1);
      insertResume.run('user-admin', JSON.stringify(emptyResumeData()));
    });
    seedAdmin();
  }

  // Users Auth API
  async findUserByEmail(email: string): Promise<User | null> {
    const row = this.db.prepare('SELECT * FROM users WHERE email = ?').get(email) as UserRow | undefined;
    return row ? rowToUser(row) : null;
  }

  async findUserById(id: string): Promise<User | null> {
    const row = this.db.prepare('SELECT * FROM users WHERE id = ?').get(id) as UserRow | undefined;
    return row ? rowToUser(row) : null;
  }

  async createUser(email: string, passwordHash: string): Promise<User> {
    const user: User = {
      id: `user-${Date.now()}`,
      email,
      passwordHash,
      isAdmin: false,
    };
    const create = this.db.transaction(() => {
      this.db
        .prepare('INSERT INTO users (id, email, password_hash, is_admin) VALUES (?, ?, ?, 0)')
        .run(user.id, user.email, user.passwordHash);
      this.db
        .prepare('INSERT INTO resumes (user_id, data) VALUES (?, ?)')
        .run(user.id, JSON.stringify(emptyResumeData()));
    });
    create();
    return user;
  }

  // Resume CRUD API
  async getResume(userId: string): Promise<ResumeData | null> {
    const row = this.db.prepare('SELECT data FROM resumes WHERE user_id = ?').get(userId) as
      | { data: string }
      | undefined;
    return row ? (JSON.parse(row.data) as ResumeData) : null;
  }

  async updateResume(userId: string, resume: ResumeData): Promise<void> {
    this.db
      .prepare(
        `INSERT INTO resumes (user_id, data, updated_at) VALUES (?, ?, CURRENT_TIMESTAMP)
         ON CONFLICT(user_id) DO UPDATE SET data = excluded.data, updated_at = CURRENT_TIMESTAMP`
      )
      .run(userId, JSON.stringify(resume));
  }
}

export const db = new SQLiteDatabase();
