import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';
import { z } from 'zod';

const updateProfileSchema = z.object({
  name: z.string().min(2, 'El nombre debe tener al menos 2 caracteres'),
  bio: z.string().max(500, 'La bio no puede superar 500 caracteres').optional(),
  image: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
});

export async function PATCH(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = session.user.id as string;
    const body = await req.json();

    const parsedData = updateProfileSchema.safeParse(body);

    if (!parsedData.success) {
      return NextResponse.json(
        { error: parsedData.error.issues[0].message },
        { status: 400 }
      );
    }

    const { name, bio, image } = parsedData.data;

    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        image: image || null,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error('Error actualizando perfil:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
