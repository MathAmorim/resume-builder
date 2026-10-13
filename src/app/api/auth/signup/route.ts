import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db, hashPassword } from '../../../../lib/db';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'E-mail e senha são obrigatórios' },
        { status: 400 }
      );
    }

    const existingUser = await db.findUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: 'Este e-mail/usuário já está em uso' },
        { status: 409 }
      );
    }

    const passwordHash = hashPassword(password);
    const user = await db.createUser(email, passwordHash);

    const cookieStore = await cookies();
    cookieStore.set('userId', user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    });

    return NextResponse.json({
      id: user.id,
      email: user.email,
      isAdmin: user.isAdmin,
    });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
