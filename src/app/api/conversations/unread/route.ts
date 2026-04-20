import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = session.user.id as string;

    // Contar mensajes no leídos
    const unreadCount = await db.message.count({
      where: {
        senderId: { not: userId },
        conversation: {
          participants: { some: { userId } },
        },
        reads: {
          none: { userId },
        },
      },
    });

    return NextResponse.json({ unreadCount });
  } catch (error) {
    console.error('Error obteniendo no leídos:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
