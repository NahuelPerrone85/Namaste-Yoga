import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = session.user.id as string;
    const { membershipId } = await req.json();

    const membership = await db.membership.findUnique({
      where: { id: membershipId },
    });

    if (!membership || !membership.stripePriceId) {
      return NextResponse.json(
        { error: 'Membresía no encontrada' },
        { status: 404 }
      );
    }

    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: [
        {
          price: membership.stripePriceId,
          quantity: 1,
        },
      ],
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/dashboard?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/precios?cancelled=true`,
      metadata: {
        userId,
        membershipId: membership.id,
      },
    });

    return NextResponse.json({ url: checkoutSession.url });
  } catch (error) {
    console.error('Error creando checkout:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
