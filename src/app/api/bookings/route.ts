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

    const bookings = await db.booking.findMany({
      where: {
        userId,
        status: 'CONFIRMED',
      },
      include: {
        class: {
          include: {
            instructor: {
              include: {
                user: { select: { name: true } },
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

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = session.user.id as string;
    const { classId } = await req.json();

    if (!classId) {
      return NextResponse.json(
        { error: 'classId es requerido' },
        { status: 400 }
      );
    }

    // Verificar que el usuario tiene membresía activa
    const activeMembership = await db.userMembership.findFirst({
      where: {
        userId,
        isActive: true,
        endDate: { gte: new Date() },
      },
      include: { membership: true },
    });

    if (!activeMembership) {
      return NextResponse.json(
        { error: 'Necesitas una membresía activa para reservar clases' },
        { status: 403 }
      );
    }

    // Verificar límite de clases si el plan tiene límite
    if (
      activeMembership.membership.classLimit !== null &&
      activeMembership.classesUsed >= activeMembership.membership.classLimit
    ) {
      return NextResponse.json(
        { error: 'Has alcanzado el límite de clases de tu membresía' },
        { status: 403 }
      );
    }

    // Verificar que la clase existe
    const yogaClass = await db.class.findUnique({
      where: { id: classId },
      include: {
        bookings: { where: { status: 'CONFIRMED' } },
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

    // Verificar reserva existente
    const existingBooking = await db.booking.findUnique({
      where: {
        userId_classId: { userId, classId },
      },
    });

    if (existingBooking) {
      if (existingBooking.status === 'CONFIRMED') {
        return NextResponse.json(
          { error: 'Ya tienes una reserva para esta clase' },
          { status: 400 }
        );
      }

      // Reactivar reserva cancelada
      const updated = await db.booking.update({
        where: { id: existingBooking.id },
        data: { status: 'CONFIRMED' },
      });

      // Actualizar contador
      if (activeMembership.membership.classLimit !== null) {
        await db.userMembership.update({
          where: { id: activeMembership.id },
          data: { classesUsed: { increment: 1 } },
        });
      }

      return NextResponse.json(updated, { status: 200 });
    }

    // Crear nueva reserva
    const booking = await db.booking.create({
      data: {
        userId,
        classId,
        status: 'CONFIRMED',
      },
    });

    // Actualizar contador de clases usadas
    if (activeMembership.membership.classLimit !== null) {
      await db.userMembership.update({
        where: { id: activeMembership.id },
        data: { classesUsed: { increment: 1 } },
      });
    }

    return NextResponse.json(booking, { status: 201 });
  } catch (error) {
    console.error('Error creando reserva:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
