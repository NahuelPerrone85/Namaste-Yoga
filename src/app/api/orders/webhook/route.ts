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

    if (event.type === 'checkout.session.completed') {
      const session = event.data.object as Stripe.Checkout.Session;
      const orderId = session.metadata?.orderId;

      if (!orderId) {
        return NextResponse.json(
          { error: 'Order ID no encontrado' },
          { status: 400 }
        );
      }

      // Obtener la orden con sus items
      const order = await db.order.findUnique({
        where: { id: orderId },
        include: { orderItems: true },
      });

      if (!order) {
        return NextResponse.json(
          { error: 'Orden no encontrada' },
          { status: 404 }
        );
      }

      // Actualizar estado de la orden
      await db.order.update({
        where: { id: orderId },
        data: {
          status: 'PAID',
          stripePaymentId: session.payment_intent as string,
        },
      });

      // Reducir stock de productos
      for (const item of order.orderItems) {
        await db.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      console.log(`✅ Orden ${orderId} pagada correctamente`);
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error('Error en webhook:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
