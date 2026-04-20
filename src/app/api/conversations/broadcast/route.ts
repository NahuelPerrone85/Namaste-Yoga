import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const userId = session.user.id as string;
    const { targetUserIds, content } = await req.json();

    if (!targetUserIds?.length || !content?.trim()) {
      return NextResponse.json(
        { error: 'Faltan destinatarios o mensaje' },
        { status: 400 }
      );
    }

    const results = [];

    for (const targetUserId of targetUserIds) {
      // Buscar o crear conversación
      let conversation = await db.conversation.findFirst({
        where: {
          AND: [
            { participants: { some: { userId } } },
            { participants: { some: { userId: targetUserId } } },
          ],
        },
      });

      if (!conversation) {
        conversation = await db.conversation.create({
          data: {
            participants: {
              create: [{ userId }, { userId: targetUserId }],
            },
          },
        });
      }

      // Enviar mensaje
      const message = await db.message.create({
        data: {
          conversationId: conversation.id,
          senderId: userId,
          content: content.trim(),
          reads: { create: { userId } },
        },
      });

      await db.conversation.update({
        where: { id: conversation.id },
        data: { updatedAt: new Date() },
      });

      results.push({ conversationId: conversation.id, messageId: message.id });
    }

    return NextResponse.json({
      message: `Mensaje enviado a ${results.length} usuarios`,
      results,
    });
  } catch (error) {
    console.error('Error enviando mensaje masivo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
