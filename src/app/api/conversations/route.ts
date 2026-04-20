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

    const conversations = await db.conversation.findMany({
      where: {
        participants: {
          some: { userId },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, image: true, role: true },
            },
          },
        },
        messages: {
          orderBy: { createdAt: 'desc' },
          take: 1,
        },
      },
      orderBy: { updatedAt: 'desc' },
    });

    return NextResponse.json(conversations);
  } catch (error) {
    console.error('Error obteniendo conversaciones:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = session.user.id as string;
    const { targetUserId } = await req.json();

    if (!targetUserId) {
      return NextResponse.json(
        { error: 'targetUserId es requerido' },
        { status: 400 }
      );
    }

    // Verificar si ya existe una conversación entre los dos usuarios
    const existing = await db.conversation.findFirst({
      where: {
        AND: [
          { participants: { some: { userId } } },
          { participants: { some: { userId: targetUserId } } },
        ],
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, image: true, role: true },
            },
          },
        },
      },
    });

    if (existing) {
      return NextResponse.json(existing);
    }

    // Crear nueva conversación
    const conversation = await db.conversation.create({
      data: {
        participants: {
          create: [{ userId }, { userId: targetUserId }],
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: { id: true, name: true, image: true, role: true },
            },
          },
        },
      },
    });

    return NextResponse.json(conversation, { status: 201 });
  } catch (error) {
    console.error('Error creando conversación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
