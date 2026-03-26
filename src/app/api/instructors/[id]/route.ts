import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateInstructorSchema = z.object({
  name: z.string().min(2).optional(),
  bio: z.string().optional(),
  specialty: z.array(z.string()).optional(),
  image: z.string().optional(),
});

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const instructor = await db.instructor.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            name: true,
            email: true,
            image: true,
            bio: true,
            createdAt: true,
          },
        },
        classes: {
          where: {
            status: 'SCHEDULED',
            startTime: { gte: new Date() },
          },
          include: {
            classType: true,
            bookings: {
              where: { status: 'CONFIRMED' },
              select: { id: true },
            },
          },
          orderBy: { startTime: 'asc' },
          take: 10,
        },
      },
    });

    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor no encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(instructor);
  } catch (error) {
    console.error('Error obteniendo instructor:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

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
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await params;
    const body = await req.json();

    const parsedData = updateInstructorSchema.safeParse(body);
    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, bio, specialty, image } = parsedData.data;

    const instructor = await db.instructor.findUnique({
      where: { id },
      include: { user: true },
    });

    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor no encontrado' },
        { status: 404 }
      );
    }

    await db.user.update({
      where: { id: instructor.userId },
      data: { name, bio, image },
    });

    const updatedInstructor = await db.instructor.update({
      where: { id },
      data: { bio, specialty },
      include: {
        user: {
          select: { name: true, email: true, image: true, bio: true },
        },
      },
    });

    return NextResponse.json(updatedInstructor);
  } catch (error) {
    console.error('Error editando instructor:', error);
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
    if (role !== 'ADMIN') {
      return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
    }

    const { id } = await params;

    const instructor = await db.instructor.findUnique({
      where: { id },
      include: {
        classes: {
          where: { status: 'SCHEDULED' },
        },
      },
    });

    if (!instructor) {
      return NextResponse.json(
        { error: 'Instructor no encontrado' },
        { status: 404 }
      );
    }

    if (instructor.classes.length > 0) {
      return NextResponse.json(
        { error: 'No puedes eliminar un instructor con clases programadas' },
        { status: 400 }
      );
    }

    await db.instructor.delete({ where: { id } });

    await db.user.update({
      where: { id: instructor.userId },
      data: { role: 'MEMBER' },
    });

    return NextResponse.json({ message: 'Instructor eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando instructor:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
