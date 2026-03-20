import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { id } = await params;

    const booking = await db.booking.findUnique({
      where: { id },
      include: { class: true },
    });

    if (!booking) {
      return NextResponse.json(
        { error: 'Reserva no encontrada' },
        { status: 404 }
      );
    }

    // Verificar que la reserva es del usuario
    if (booking.userId !== session.user!.id) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    // Verificar política de cancelación (2h antes)
    const twoHoursBefore = new Date(booking.class.startTime);
    twoHoursBefore.setHours(twoHoursBefore.getHours() - 2);

    if (new Date() > twoHoursBefore) {
      return NextResponse.json(
        { error: 'No puedes cancelar con menos de 2 horas de antelación' },
        { status: 400 }
      );
    }

    await db.booking.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    return NextResponse.json({ message: 'Reserva cancelada correctamente' });
  } catch (error) {
    console.error('Error cancelando reserva:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
