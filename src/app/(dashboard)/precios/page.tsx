import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import PricingCards from '@/components/booking/PricingCards';

export default async function PreciosPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  const memberships = await db.membership.findMany({
    orderBy: { price: 'asc' },
  });

  const activeMembership = await db.userMembership.findFirst({
    where: {
      userId: session.user.id,
      isActive: true,
      endDate: { gte: new Date() },
    },
    include: { membership: true },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-3xl font-bold text-gray-900">
            💳 Planes y Precios
          </h1>
          <p className="text-gray-500">
            Elige el plan que mejor se adapte a ti
          </p>
          {activeMembership && (
            <div className="mt-4 inline-block rounded-lg bg-green-100 px-4 py-2 text-sm font-medium text-green-700">
              ✓ Tienes activo el {activeMembership.membership.name}
            </div>
          )}
        </div>
        <PricingCards
          memberships={memberships}
          activeMembershipId={activeMembership?.membershipId}
        />
      </div>
    </div>
  );
}
