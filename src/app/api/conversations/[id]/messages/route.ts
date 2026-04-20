import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = session.user.id as string;
    const { id: conversationId } = await params;

    const participant = await db.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });

    if (!participant) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const messages = await db.message.findMany({
      where: { conversationId },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        reads: { select: { userId: true } },
      },
      orderBy: { createdAt: 'asc' },
    });

    // Marcar mensajes no leídos como leídos
    const unreadMessages = messages.filter(
      (m) => m.senderId !== userId && !m.reads.some((r) => r.userId === userId)
    );

    if (unreadMessages.length > 0) {
      await db.messageRead.createMany({
        data: unreadMessages.map((m) => ({
          messageId: m.id,
          userId,
        })),
        skipDuplicates: true,
      });
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error obteniendo mensajes:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = session.user.id as string;
    const { id: conversationId } = await params;
    const { content } = await req.json();

    if (!content?.trim()) {
      return NextResponse.json(
        { error: 'El mensaje no puede estar vacío' },
        { status: 400 }
      );
    }

    const participant = await db.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });

    if (!participant) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const message = await db.message.create({
      data: {
        conversationId,
        senderId: userId,
        content: content.trim(),
        reads: {
          create: { userId }, // El remitente ya lo ha leído
        },
      },
      include: {
        sender: { select: { id: true, name: true, image: true } },
        reads: { select: { userId: true } },
      },
    });

    await db.conversation.update({
      where: { id: conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json(message, { status: 201 });
  } catch (error) {
    console.error('Error enviando mensaje:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
