import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '../../../../lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get('userId');
    
    if (!userIdCookie || !userIdCookie.value) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const userId = userIdCookie.value;
    const user = await db.findUserById(userId);

    if (!user) {
      return NextResponse.json({ error: 'Usuário não encontrado' }, { status: 404 });
    }

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
