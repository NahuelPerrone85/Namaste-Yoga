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
      const metadata = session.metadata;

      console.log('Metadata:', metadata);

      // Venta de tienda (tiene orderId)
      if (metadata?.orderId) {
        const order = await db.order.findUnique({
          where: { id: metadata.orderId },
          include: { orderItems: true },
        });

        if (!order) {
          console.error('Orden no encontrada:', metadata.orderId);
          return NextResponse.json(
            { error: 'Orden no encontrada' },
            { status: 404 }
          );
        }

        await db.order.update({
          where: { id: metadata.orderId },
          data: {
            status: 'PAID',
            stripePaymentId: session.payment_intent as string,
          },
        });

        // Reducir stock
        for (const item of order.orderItems) {
          await db.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });
        }

        console.log(`✅ Orden ${metadata.orderId} pagada`);
      }

      // Compra de membresía (tiene membershipId)
      if (metadata?.membershipId && metadata?.userId) {
        const membership = await db.membership.findUnique({
          where: { id: metadata.membershipId },
        });

        if (!membership) {
          console.error('Membresía no encontrada:', metadata.membershipId);
          return NextResponse.json(
            { error: 'Membresía no encontrada' },
            { status: 404 }
          );
        }

        const endDate = new Date();
        endDate.setDate(endDate.getDate() + membership.duration);

        await db.userMembership.updateMany({
          where: { userId: metadata.userId, isActive: true },
          data: { isActive: false },
        });

        const userMembership = await db.userMembership.create({
          data: {
            userId: metadata.userId,
            membershipId: membership.id,
            endDate,
            isActive: true,
          },
        });

        await db.payment.create({
          data: {
            userId: metadata.userId,
            userMembershipId: userMembership.id,
            amount: membership.price,
            currency: 'EUR',
            status: 'COMPLETED',
            stripePaymentId: session.payment_intent as string,
          },
        });

        console.log(`✅ Membresía activada para usuario ${metadata.userId}`);
      }
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
