import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import Stripe from 'stripe';

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature')!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error) {
    console.error('Error verificando webhook:', error);
    return NextResponse.json({ error: 'Webhook inválido' }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;

    const userId = session.metadata?.userId;
    const membershipId = session.metadata?.membershipId;

    if (!userId || !membershipId) {
      return NextResponse.json(
        { error: 'Metadata incompleta' },
        { status: 400 }
      );
    }

    const membership = await db.membership.findUnique({
      where: { id: membershipId },
    });

    if (!membership) {
      return NextResponse.json(
        { error: 'Membresía no encontrada' },
        { status: 404 }
      );
    }

    const endDate = new Date();
    endDate.setDate(endDate.getDate() + membership.duration);

    // Desactivar membresías anteriores
    await db.userMembership.updateMany({
      where: { userId, isActive: true },
      data: { isActive: false },
    });

    // Crear nueva membresía activa
    const userMembership = await db.userMembership.create({
      data: {
        userId,
        membershipId,
        endDate,
        isActive: true,
      },
    });

    // Registrar el pago
    await db.payment.create({
      data: {
        userId,
        userMembershipId: userMembership.id,
        amount: membership.price,
        currency: 'EUR',
        status: 'COMPLETED',
        stripePaymentId: session.payment_intent as string,
      },
    });

    console.log(`✅ Membresía activada para usuario ${userId}`);
  }

  return NextResponse.json({ received: true });
}
