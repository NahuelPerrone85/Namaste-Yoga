import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import ShopClient from '@/components/shop/ShopClient';

export default async function TiendaPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  const products = await db.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FDFAF5',
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#3D3530',
              letterSpacing: '-0.5px',
              marginBottom: '8px',
            }}
          >
            Tienda Shanti 🛍️
          </h1>
          <p style={{ fontSize: '15px', color: '#9E8E82' }}>
            Productos seleccionados para tu práctica
          </p>
        </div>

        <ShopClient products={products} />
      </div>
    </div>
  );
}
