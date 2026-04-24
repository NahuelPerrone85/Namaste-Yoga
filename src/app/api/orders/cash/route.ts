import { NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db';

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

    const { items, customerName } = await req.json();

    if (!items || items.length === 0) {
      return NextResponse.json(
        { error: 'El carrito está vacío' },
        { status: 400 }
      );
    }

    const products = await db.product.findMany({
      where: {
        id: { in: items.map((i: { productId: string }) => i.productId) },
        isActive: true,
      },
    });

    for (const item of items) {
      const product = products.find((p) => p.id === item.productId);
      if (!product) {
        return NextResponse.json(
          { error: 'Producto no encontrado' },
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

    const total = items.reduce(
      (acc: number, item: { productId: string; quantity: number }) => {
        const product = products.find((p) => p.id === item.productId)!;
        return acc + product.price * item.quantity;
      },
      0
    );

    let cashUser = await db.user.findUnique({
      where: { email: 'efectivo@shanti.com' },
    });

    if (!cashUser) {
      cashUser = await db.user.create({
        data: {
          name: customerName || 'Venta en efectivo',
          email: 'efectivo@shanti.com',
          role: 'MEMBER',
        },
      });
    }

    const order = await db.order.create({
      data: {
        userId: cashUser.id,
        total,
        status: 'PAID',
        orderItems: {
          create: items.map((item: { productId: string; quantity: number }) => {
            const product = products.find((p) => p.id === item.productId)!;
            return {
              productId: item.productId,
              quantity: item.quantity,
              price: product.price,
            };
          }),
        },
      },
      include: { orderItems: true },
    });

    for (const item of items) {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    return NextResponse.json({
      message: `Venta registrada correctamente. Total: ${total.toFixed(2)}€`,
      orderId: order.id,
      total,
    });
  } catch (error) {
    console.error('Error registrando venta en efectivo:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
