import { NextResponse } from 'next/server';
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
