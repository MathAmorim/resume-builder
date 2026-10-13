# 📄 Resume Builder

Aplicação web completa e moderna para criação, edição e exportação de currículos profissionais, construída com **Next.js**, **React**, **Tailwind CSS**, **Zustand** e banco de dados local **SQLite**.

---

## ✨ Funcionalidades

- **Edição Interativa em Tempo Real:** Painéis organizados para dados pessoais, objetivos, resumo, escolaridade, cursos, experiências profissionais, idiomas e habilidades técnicas.
- **2 Modelos de Exportação para PDF:**
  - **Modelo 1 (Clássico / Foto):** Layout tradicional com foto de perfil circular, duas colunas para dados pessoais/objetivos e distribuição harmoniosa sem espaços vazios.
  - **Modelo 2 (Moderno / Executivo ATS):** Cabeçalho limpo sem foto, títulos destacados em azul royal, datas alinhadas à direita, experiências estruturadas em tópicos com marcadores (`•`) e habilidades/idiomas em colunas.
  - **Alternância de Idioma nos Títulos:** Opção de alternar os títulos do Modelo Moderno entre **Português (PT)** e **Inglês (EN)** com um clique.
- **Visualização Prévia Instantânea:** Modal com alternância rápida entre os modelos de PDF antes de imprimir ou salvar.
- **Persistência em Banco Local SQLite:**
  - Armazenamento em `data/resume.db` via `better-sqlite3`.
  - Salvamento automático de alterações em segundo plano.
- **Autenticação e Multi-usuário:**
  - Conta inicial de Administrador (`admin` / `admin`).
  - Criação de novas contas com currículo em branco para preenchimento.
- **Privacidade e Proteção para o Git:**
  - Código-fonte 100% limpo, sem nenhum dado pessoal hardcoded.
  - `.gitignore` configurado para ignorar bancos de dados (`*.db`, `*.sqlite*`, `database.json`) e arquivos de dados locais.
  - Foto padrão com fallback automático para `/photo-placeholder.jpg`.

---

## 🚀 Como Executar

### Opção 1: Via Windows (`start.bat` - Recomendado)

Se você estiver no Windows, basta dar um **duplo clique** no arquivo:
```
start.bat
```
> O script verifica se o Node.js está presente, instala automaticamente todas as dependências (`npm install`) caso seja a primeira vez que você roda o projeto após um clone, inicia o servidor e abre o navegador em `http://localhost:3000`.

---

### Opção 2: Manualmente via Terminal

#### Pré-requisitos
- [Node.js](https://nodejs.org/) (versão 18 ou superior instalada).

#### Passo a passo

1. **Clone o repositório:**
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd resume-builder
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

4. **Acesse no navegador:**
   Abra [http://localhost:3000](http://localhost:3000).

---

## 🔐 Acesso ao Sistema

- **Administrador Padrão:**
  - **Usuário:** `admin`
  - **Senha:** `admin`
- **Novo Usuário:**
  - Clique na aba **"Cadastre-se"** na tela de login para criar uma conta do zero com um currículo em branco.

---

## 🛠️ Tecnologias Utilizadas

- **Frontend:** [Next.js](https://nextjs.org/) (App Router), [React](https://react.dev/), [Tailwind CSS](https://tailwindcss.com/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Gerenciamento de Estado:** [Zustand](https://github.com/pmndrs/zustand)
- **Banco de Dados Local:** [SQLite](https://www.sqlite.org/) via [`better-sqlite3`](https://github.com/WiseLibs/better-sqlite3)

---

## 📂 Estrutura do Projeto

```
resume-builder/
├── data/                  # Banco SQLite local (ignorado pelo Git)
│   └── resume.db
├── public/                # Imagens estáticas e foto padrão (photo-placeholder.jpg)
├── src/
│   ├── app/
│   │   ├── api/           # Rotas de autenticação e CRUD do currículo
│   │   ├── globals.css    # Estilos globais e regras de impressão (@media print)
│   │   └── page.tsx       # Página principal do editor e prévia
│   ├── components/
│   │   ├── AuthScreen.tsx       # Tela de login e cadastro
│   │   ├── EditModal.tsx        # Modais de edição de cada seção
│   │   ├── ResumePDF.tsx        # Renderizador e despachante dos modelos de PDF
│   │   └── ResumeModernPDF.tsx  # Modelo 2 (Moderno / Executivo ATS)
│   ├── lib/
│   │   └── db.ts          # Camada de dados SQLite (better-sqlite3)
│   ├── store/
│   │   └── useResumeStore.ts    # Estado global e auto-sync
│   └── types/
│       └── resume.ts      # Tipos e interfaces TypeScript
├── start.bat              # Inicializador automático para Windows
└── README.md              # Documentação do projeto
```
