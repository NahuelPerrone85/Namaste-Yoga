import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET() {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const bookings = await db.booking.findMany({
      where: {
        userId: session.user!.id,
        status: 'CONFIRMED',
      },
      include: {
        class: {
          include: {
            instructor: {
              include: {
                user: {
                  select: { name: true },
                },
              },
            },
            classType: true,
          },
        },
      },
      orderBy: {
        class: { startTime: 'asc' },
      },
    });

    return NextResponse.json(bookings);
  } catch (error) {
    console.error('Error obteniendo reservas:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const { classId } = await req.json();

    if (!classId) {
      return NextResponse.json(
        { error: 'classId es requerido' },
        { status: 400 }
      );
    }

    const yogaClass = await db.class.findUnique({
      where: { id: classId },
      include: {
        bookings: {
          where: { status: 'CONFIRMED' },
        },
      },
    });

    if (!yogaClass) {
      return NextResponse.json(
        { error: 'Clase no encontrada' },
        { status: 404 }
      );
    }

    if (yogaClass.bookings.length >= yogaClass.capacity) {
      return NextResponse.json(
        { error: 'La clase está llena' },
        { status: 400 }
      );
    }

    if (yogaClass.startTime < new Date()) {
      return NextResponse.json(
        { error: 'No puedes reservar una clase pasada' },
        { status: 400 }
      );
    }

    const existingBooking = await db.booking.findUnique({
      where: {
        userId_classId: {
          userId: session.user!.id,
          classId,
        },
      },
    });

    if (existingBooking) {
      if (existingBooking.status === 'CONFIRMED') {
        return NextResponse.json(
          { error: 'Ya tienes una reserva para esta clase' },
          { status: 400 }
        );
      }

      // Si estaba cancelada, la reactivamos
      const updated = await db.booking.update({
        where: { id: existingBooking.id },
        data: { status: 'CONFIRMED' },
      });

      return NextResponse.json(updated, { status: 200 });
    }

    const booking = await db.booking.create({
      data: {
        userId: session.user!.id,
        classId,
        status: 'CONFIRMED',
      },
    });

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creando reserva:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
