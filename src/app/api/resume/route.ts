import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { db } from '../../../lib/db';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get('userId');
    
    if (!userIdCookie || !userIdCookie.value) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const userId = userIdCookie.value;
    const resume = await db.getResume(userId);
    
    if (!resume) {
      return NextResponse.json({ error: 'Currículo não encontrado' }, { status: 404 });
    }

    return NextResponse.json(resume);
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const userIdCookie = cookieStore.get('userId');
    
    if (!userIdCookie || !userIdCookie.value) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 });
    }

    const userId = userIdCookie.value;
    const resumeData = await req.json();
    
    await db.updateResume(userId, resumeData);
    
    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message || 'Erro interno no servidor' },
      { status: 500 }
    );
  }
}
