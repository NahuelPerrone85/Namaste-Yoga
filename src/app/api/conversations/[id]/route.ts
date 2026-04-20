import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function DELETE(
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

    // Verificar que el usuario es participante
    const participant = await db.conversationParticipant.findUnique({
      where: { conversationId_userId: { conversationId, userId } },
    });

    if (!participant) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    // Eliminar conversación completa
    await db.conversation.delete({
      where: { id: conversationId },
    });

    return NextResponse.json({ message: 'Conversación eliminada' });
  } catch (error) {
    console.error('Error eliminando conversación:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
