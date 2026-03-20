import Stripe from 'stripe';
import { PrismaClient } from '@prisma/client';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2026-02-25.clover',
});

const prisma = new PrismaClient();

async function main() {
  console.log('🔧 Configurando productos en Stripe...');

  const memberships = await prisma.membership.findMany();

  for (const membership of memberships) {
    // Crear producto en Stripe
    const product = await stripe.products.create({
      name: membership.name,
      description: membership.description || undefined,
    });

    // Crear precio en Stripe
    const price = await stripe.prices.create({
      product: product.id,
      unit_amount: Math.round(membership.price * 100),
      currency: 'eur',
    });

    // Guardar el priceId en la base de datos
    await prisma.membership.update({
      where: { id: membership.id },
      data: { stripePriceId: price.id },
    });

    console.log(`✅ ${membership.name} → ${price.id}`);
  }

  console.log('🎉 Productos creados en Stripe');
  await prisma.$disconnect();
}

main().catch(console.error);
