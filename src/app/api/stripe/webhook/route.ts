import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';
import Stripe from 'stripe';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = req.headers.get('stripe-signature');

    if (!signature) {
      return NextResponse.json({ error: 'No signature' }, { status: 400 });
    }

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

    console.log('Webhook recibido:', event.type);

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;

      console.log('Session metadata:', session.metadata);

      const userId = session.metadata?.userId;
      const membershipId = session.metadata?.membershipId;

      if (!userId || !membershipId) {
        console.error('Metadata incompleta:', session.metadata);
        return NextResponse.json(
          { error: 'Metadata incompleta' },
          { status: 400 }
        );
      }

      const membership = await db.membership.findUnique({
        where: { id: membershipId },
      });

      if (!membership) {
        console.error('Membresía no encontrada:', membershipId);
        return NextResponse.json(
          { error: 'Membresía no encontrada' },
          { status: 404 }
        );
      }

      const endDate = new Date();
      endDate.setDate(endDate.getDate() + membership.duration);

      await db.userMembership.updateMany({
        where: { userId, isActive: true },
        data: { isActive: false },
      });

      const userMembership = await db.userMembership.create({
        data: {
          userId,
          membershipId,
          endDate,
          isActive: true,
        },
      });

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

      console.log('Membresia activada para usuario:', userId);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (error) {
    console.error('Error en webhook:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
