'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

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
    'Todas las disciplinas',
    'Reserva online 24/7',
    'Cancelación hasta 2h antes',
  ],
  PREMIUM: [
    'Clases ilimitadas',
    'Todas las disciplinas',
    'Acceso prioritario',
    'Reserva online 24/7',
    'Cancelación hasta 2h antes',
  ],
  QUARTERLY: [
    'Clases ilimitadas 3 meses',
    'Todas las disciplinas',
    'Acceso prioritario',
    'Reserva online 24/7',
    '15% de descuento',
    'Cancelación hasta 2h antes',
  ],
  ANNUAL: [
    'Clases ilimitadas 12 meses',
    'Todas las disciplinas',
    'Acceso prioritario VIP',
    'Reserva online 24/7',
    '25% de descuento',
    'Clase de bienvenida gratis',
  ],
};

const planEmojis: Record<string, string> = {
  BASIC: '🌱',
  PREMIUM: '🌟',
  QUARTERLY: '🎯',
  ANNUAL: '👑',
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
    } finally {
      setLoading(null);
    }
  };

  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: '20px',
      }}
    >
      {memberships.map((membership) => {
        const isActive = activeMembershipId === membership.id;
        const isPremium = membership.type === 'PREMIUM';
        const features = planFeatures[membership.type] || [];
        const emoji = planEmojis[membership.type] || '✨';
        const pricePerMonth =
          membership.duration > 30
            ? (membership.price / (membership.duration / 30)).toFixed(2)
            : null;

        return (
          <div
            key={membership.id}
            style={{
              backgroundColor: isPremium ? '#7C6BC4' : 'white',
              borderRadius: '20px',
              padding: '28px 24px',
              border: isPremium
                ? 'none'
                : isActive
                  ? '2px solid #7C6BC4'
                  : '1px solid #EDE8E0',
              boxShadow: isPremium
                ? '0 8px 32px rgba(124,107,196,0.35)'
                : '0 4px 20px rgba(0,0,0,0.04)',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            {isPremium && (
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#C4A882',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                }}
              >
                MÁS POPULAR
              </div>
            )}
            {isActive && !isPremium && (
              <div
                style={{
                  position: 'absolute',
                  top: '-12px',
                  left: '50%',
                  transform: 'translateX(-50%)',
                  backgroundColor: '#8FAF8F',
                  color: 'white',
                  fontSize: '10px',
                  fontWeight: '700',
                  padding: '4px 14px',
                  borderRadius: '20px',
                  letterSpacing: '0.5px',
                  whiteSpace: 'nowrap',
                }}
              >
                PLAN ACTUAL
              </div>
            )}

            {/* Emoji */}
            <div style={{ fontSize: '32px', marginBottom: '16px' }}>
              {emoji}
            </div>

            {/* Nombre */}
            <h3
              style={{
                fontSize: '18px',
                fontWeight: '700',
                color: isPremium ? 'white' : '#3D3530',
                marginBottom: '4px',
              }}
            >
              {membership.name}
            </h3>
            <p
              style={{
                fontSize: '13px',
                color: isPremium ? 'rgba(255,255,255,0.7)' : '#9E8E82',
                marginBottom: '20px',
              }}
            >
              {membership.description}
            </p>

            {/* Precio */}
            <div style={{ marginBottom: '24px' }}>
              <div
                style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}
              >
                <span
                  style={{
                    fontSize: '36px',
                    fontWeight: '700',
                    color: isPremium ? 'white' : '#3D3530',
                    letterSpacing: '-1px',
                  }}
                >
                  {membership.price}€
                </span>
                <span
                  style={{
                    fontSize: '13px',
                    color: isPremium ? 'rgba(255,255,255,0.6)' : '#9E8E82',
                  }}
                >
                  /
                  {membership.duration === 30
                    ? 'mes'
                    : `${membership.duration} días`}
                </span>
              </div>
              {pricePerMonth && (
                <p
                  style={{
                    fontSize: '12px',
                    color: isPremium ? 'rgba(255,255,255,0.6)' : '#9E8E82',
                    marginTop: '2px',
                  }}
                >
                  {pricePerMonth}€/mes
                </p>
              )}
            </div>

            {/* Features */}
            <ul
              style={{
                listStyle: 'none',
                padding: 0,
                margin: '0 0 24px',
                display: 'flex',
                flexDirection: 'column',
                gap: '10px',
                flex: 1,
              }}
            >
              {features.map((feature) => (
                <li
                  key={feature}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <div
                    style={{
                      width: '18px',
                      height: '18px',
                      backgroundColor: isPremium
                        ? 'rgba(255,255,255,0.2)'
                        : '#EDE9F8',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Check size={10} color={isPremium ? 'white' : '#7C6BC4'} />
                  </div>
                  <span
                    style={{
                      fontSize: '13px',
                      color: isPremium ? 'rgba(255,255,255,0.9)' : '#6B5B4E',
                    }}
                  >
                    {feature}
                  </span>
                </li>
              ))}
            </ul>

            {/* Botón */}
            <button
              onClick={() => !isActive && handleCheckout(membership.id)}
              disabled={isActive || loading === membership.id}
              style={{
                width: '100%',
                padding: '13px',
                backgroundColor: isActive
                  ? isPremium
                    ? 'rgba(255,255,255,0.2)'
                    : '#EDE9F8'
                  : isPremium
                    ? 'white'
                    : '#7C6BC4',
                color: isActive
                  ? isPremium
                    ? 'rgba(255,255,255,0.7)'
                    : '#9E8E82'
                  : isPremium
                    ? '#7C6BC4'
                    : 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: isActive ? 'default' : 'pointer',
                transition: 'opacity 0.2s',
              }}
            >
              {isActive
                ? '✓ Plan activo'
                : loading === membership.id
                  ? 'Procesando...'
                  : 'Elegir plan'}
            </button>
          </div>
        );
      })}
    </div>
  );
}
