import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import PricingCards from '@/components/booking/PricingCards';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default async function PreciosPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  const userId = session.user.id as string;

  const memberships = await db.membership.findMany({
    orderBy: { price: 'asc' },
  });

  const activeMembership = await db.userMembership.findFirst({
    where: {
      userId,
      isActive: true,
      endDate: { gte: new Date() },
    },
    include: { membership: true },
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
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <h1
            style={{
              fontSize: '36px',
              fontWeight: '700',
              color: '#3D3530',
              letterSpacing: '-0.5px',
              marginBottom: '12px',
            }}
          >
            Planes y precios ✨
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: '#9E8E82',
              maxWidth: '480px',
              margin: '0 auto',
            }}
          >
            Sin permanencia. Sin sorpresas. Cancela cuando quieras.
          </p>

          {activeMembership && (
            <div
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                backgroundColor: '#EAF2EA',
                borderRadius: '20px',
                padding: '8px 20px',
                marginTop: '20px',
              }}
            >
              <span style={{ fontSize: '14px' }}>✅</span>
              <span
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#769F76',
                }}
              >
                Tienes activo el {activeMembership.membership.name} · Expira{' '}
                {format(activeMembership.endDate, 'd MMM yyyy', { locale: es })}
              </span>
            </div>
          )}
        </div>

        <PricingCards
          memberships={memberships}
          activeMembershipId={activeMembership?.membershipId}
        />

        {/* Garantía */}
        <div
          style={{
            textAlign: 'center',
            marginTop: '48px',
            padding: '32px',
            backgroundColor: '#F5F0E8',
            borderRadius: '20px',
          }}
        >
          <p style={{ fontSize: '14px', color: '#6B5B4E', lineHeight: '1.7' }}>
            🔒 <strong>Pago 100% seguro</strong> con Stripe · Sin permanencia ·
            Cancela en cualquier momento
            <br />
            ¿Tienes dudas? Escríbenos y te ayudamos a elegir el plan perfecto
            para ti.
          </p>
        </div>
      </div>
    </div>
  );
}
