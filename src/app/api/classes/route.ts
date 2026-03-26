import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');

    const classes = await db.class.findMany({
      where: {
        startTime: {
          gte: startDate ? new Date(startDate) : new Date(),
          lte: endDate ? new Date(endDate) : undefined,
        },
        status: 'SCHEDULED',
      },
      include: {
        instructor: {
          include: {
            user: {
              select: {
                name: true,
                image: true,
              },
            },
          },
        },
        classType: true,
        bookings: {
          where: {
            status: 'CONFIRMED',
          },
          select: {
            id: true,
            userId: true,
          },
        },
      },
      orderBy: {
        startTime: 'asc',
      },
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error('Error obteniendo clases:', error);
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

    const role = (session.user as { role?: string }).role;

    if (role !== 'ADMIN' && role !== 'INSTRUCTOR') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

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

    if (
      !title ||
      !startTime ||
      !endTime ||
      !capacity ||
      !classTypeId ||
      !instructorId
    ) {
      return NextResponse.json(
        { error: 'Faltan campos obligatorios' },
        { status: 400 }
      );
    }

    const yogaClass = await db.class.create({
      data: {
        title,
        description,
        startTime: new Date(startTime),
        endTime: new Date(endTime),
        capacity: parseInt(capacity),
        classTypeId,
        instructorId,
        status: 'SCHEDULED',
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

    return NextResponse.json(yogaClass, { status: 201 });
  } catch (error) {
    console.error('Error creando clase:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
