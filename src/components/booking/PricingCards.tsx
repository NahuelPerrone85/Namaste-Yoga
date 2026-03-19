'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface Membership {
  id: string;
  name: string;
  type: string;
  description: string | null;
  price: number;
  duration: number;
  classLimit: number | null;
}

interface PricingCardsProps {
  memberships: Membership[];
  activeMembershipId?: string;
}

const planFeatures: Record<string, string[]> = {
  BASIC: [
    '8 clases al mes',
    'Acceso a todas las disciplinas',
    'Reserva online',
    'Cancelación hasta 2h antes',
  ],
  PREMIUM: [
    'Clases ilimitadas',
    'Acceso a todas las disciplinas',
    'Reserva online',
    'Cancelación hasta 2h antes',
    'Acceso prioritario',
  ],
  QUARTERLY: [
    'Clases ilimitadas 3 meses',
    'Acceso a todas las disciplinas',
    'Reserva online',
    'Cancelación hasta 2h antes',
    'Acceso prioritario',
    '15% de descuento',
  ],
  ANNUAL: [
    'Clases ilimitadas 12 meses',
    'Acceso a todas las disciplinas',
    'Reserva online',
    'Cancelación hasta 2h antes',
    'Acceso prioritario',
    '25% de descuento',
    'Clase de bienvenida gratis',
  ],
};

export default function PricingCards({
  memberships,
  activeMembershipId,
}: PricingCardsProps) {
  const router = useRouter();
  const [loading, setLoading] = useState<string | null>(null);

  const handleCheckout = async (membershipId: string) => {
    setLoading(membershipId);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ membershipId }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      router.push(data.url);
    } catch (error) {
      console.error('Error:', error);
      alert('Error al procesar el pago');
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {memberships.map((membership) => {
        const isActive = activeMembershipId === membership.id;
        const isPremium = membership.type === 'PREMIUM';
        const features = planFeatures[membership.type] || [];
        const pricePerMonth =
          membership.duration > 30
            ? (membership.price / (membership.duration / 30)).toFixed(2)
            : null;

        return (
          <Card
            key={membership.id}
            className={`relative ${isPremium ? 'border-2 border-purple-500 shadow-lg' : ''}`}
          >
            {isPremium && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <Badge className="bg-purple-600 px-3 text-white">
                  Más popular
                </Badge>
              </div>
            )}
            <CardContent className="p-6">
              <h3 className="mb-1 text-lg font-bold text-gray-900">
                {membership.name}
              </h3>
              <p className="mb-4 text-sm text-gray-500">
                {membership.description}
              </p>

              <div className="mb-4">
                <span className="text-3xl font-bold text-gray-900">
                  {membership.price}€
                </span>
                <span className="text-sm text-gray-500">
                  /
                  {membership.duration === 30
                    ? 'mes'
                    : `${membership.duration} días`}
                </span>
                {pricePerMonth && (
                  <p className="mt-1 text-xs text-gray-400">
                    {pricePerMonth}€/mes
                  </p>
                )}
              </div>

              <ul className="mb-6 space-y-2">
                {features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-center gap-2 text-sm text-gray-600"
                  >
                    <Check className="h-4 w-4 flex-shrink-0 text-green-500" />
                    {feature}
                  </li>
                ))}
              </ul>

              <Button
                className={`w-full ${
                  isPremium
                    ? 'bg-purple-600 text-white hover:bg-purple-700'
                    : ''
                }`}
                variant={isPremium ? 'default' : 'outline'}
                disabled={isActive || loading === membership.id}
                onClick={() => handleCheckout(membership.id)}
              >
                {isActive
                  ? '✓ Plan activo'
                  : loading === membership.id
                    ? 'Procesando...'
                    : 'Elegir plan'}
              </Button>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
