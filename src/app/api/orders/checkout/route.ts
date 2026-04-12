import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { stripe } from '@/lib/stripe';
import { db } from '@/lib/db';

interface CartItem {
  productId: string;
  quantity: number;
}

export async function POST(req: Request) {
  try {
    const session = await auth();

    if (!session || !session.user) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
    }

    const userId = session.user.id as string;
    const { items }: { items: CartItem[] } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'El carrito está vacío' },
        { status: 400 }
      );
    }

    // Obtener productos de la BD
    const products = await db.product.findMany({
      where: {
        id: { in: items.map((i) => i.productId) },
        isActive: true,
      },
    });

    if (products.length === 0) {
      return NextResponse.json(
        { error: 'No se encontraron productos' },
        { status: 404 }
      );
    }

    // Verificar stock
    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: `Producto no encontrado` },
          { status: 404 }
        );
      }
      if (product.stock < item.quantity) {
        return NextResponse.json(
          { error: `Stock insuficiente para ${product.name}` },
          { status: 400 }
        );
      }
    }

    // Crear line items para Stripe
    const lineItems = items.map((item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return {
        price_data: {
          currency: 'eur',
          product_data: {
            name: product.name,
            description: product.description || undefined,
            images: product.image ? [product.image] : [],
          },
          unit_amount: Math.round(product.price * 100),
        },
        quantity: item.quantity,
      };
    });

    // Calcular total
    const total = items.reduce((acc, item) => {
      const product = products.find((p) => p.id === item.productId)!;
      return acc + product.price * item.quantity;
    }, 0);

    // Crear orden en BD
    const order = await db.order.create({
      data: {
        userId,
        total,
        status: 'PENDING',
        orderItems: {
          create: items.map((item) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
            };
          }),
        },
      },
    });

    // Crear sesión de Stripe
    const checkoutSession = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${process.env.NEXTAUTH_URL}/tienda?success=true`,
      cancel_url: `${process.env.NEXTAUTH_URL}/tienda?cancelled=true`,
      metadata: {
        orderId: order.id,
        userId,
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
