import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== 'ADMIN' && role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();
    const {
      title,
      description,
      startTime,
      endTime,
      capacity,
      classTypeId,
      instructorId,
    } = body;

    const yogaClass = await db.class.update({
      where: { id },
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        capacity: parseInt(capacity),
        classTypeId,
        instructorId,
      },
      include: {
        classType: true,
        instructor: {
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    return NextResponse.json(yogaClass);
  } catch (error) {
    console.error('Error editando clase:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const role = (session.user as { role?: string }).role;
    if (role !== 'ADMIN' && role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await params;

    // Cancelar la clase en vez de eliminarla
    const yogaClass = await db.class.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });

    // Cancelar todas las reservas de esa clase
    await db.booking.updateMany({
      where: { classId: id, status: 'CONFIRMED' },
      data: { status: 'CANCELLED' },
    });

    return NextResponse.json(yogaClass);
  } catch (error) {
    console.error('Error cancelando clase:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
