'use client';

import { Clock, Users, User } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface ClassCardProps {
  yogaClass: {
    id: string;
    title: string;
    startTime: string;
    endTime: string;
    capacity: number;
    classType: { name: string; color: string };
    instructor: { user: { name: string | null } };
    bookings: { id: string; userId: string }[];
  };
  currentUserId?: string;
  onBook: (classId: string) => void;
  onCancel: (bookingId: string) => void;
  isLoading?: boolean;
}

export default function ClassCard({
  yogaClass,
  currentUserId,
  onBook,
  onCancel,
  isLoading,
}: ClassCardProps) {
  const spotsLeft = yogaClass.capacity - yogaClass.bookings.length;
  const isFull = spotsLeft === 0;
  const userBooking = yogaClass.bookings.find(
    (b) => b.userId === currentUserId
  );
  const isBooked = !!userBooking;

  const startTime = format(new Date(yogaClass.startTime), 'HH:mm', {
    locale: es,
  });
  const endTime = format(new Date(yogaClass.endTime), 'HH:mm', { locale: es });
  const duration =
    (new Date(yogaClass.endTime).getTime() -
      new Date(yogaClass.startTime).getTime()) /
    60000;

  const getEmoji = (name: string) => {
    if (name.includes('Hatha')) return '🧘';
    if (name.includes('Vinyasa')) return '🌊';
    if (name.includes('Yin')) return '🌙';
    return '✨';
  };

  return (
    <div
      style={{
        backgroundColor: isBooked ? '#EDE9F8' : 'white',
        borderRadius: '12px',
        padding: '12px',
        border: isBooked ? '1px solid #C4B8E8' : '1px solid #EDE8E0',
        transition: 'all 0.15s',
      }}
    >
      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '8px',
        }}
      >
        <span style={{ fontSize: '16px' }}>
          {getEmoji(yogaClass.classType.name)}
        </span>
        {isBooked && (
          <span
            style={{
              fontSize: '10px',
              fontWeight: '600',
              color: '#7C6BC4',
              backgroundColor: 'white',
              padding: '2px 8px',
              borderRadius: '20px',
            }}
          >
            ✓ Reservado
          </span>
        )}
      </div>

      {/* Título */}
      <p
        style={{
          fontSize: '12px',
          fontWeight: '600',
          color: '#3D3530',
          marginBottom: '6px',
          lineHeight: '1.3',
        }}
      >
        {yogaClass.title}
      </p>

      {/* Info */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '3px',
          marginBottom: '10px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Clock size={10} color="#9E8E82" />
          <span style={{ fontSize: '11px', color: '#9E8E82' }}>
            {startTime} · {duration}min
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <User size={10} color="#9E8E82" />
          <span style={{ fontSize: '11px', color: '#9E8E82' }}>
            {yogaClass.instructor.user.name}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <Users
            size={10}
            color={isFull ? '#DC2626' : spotsLeft <= 3 ? '#D97706' : '#8FAF8F'}
          />
          <span
            style={{
              fontSize: '11px',
              color: isFull
                ? '#DC2626'
                : spotsLeft <= 3
                  ? '#D97706'
                  : '#8FAF8F',
              fontWeight: '500',
            }}
          >
            {isFull ? 'Llena' : `${spotsLeft} plazas`}
          </span>
        </div>
      </div>

      {/* Botón */}
      {isBooked ? (
        <button
          onClick={() => onCancel(userBooking.id)}
          disabled={isLoading}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: 'transparent',
            color: '#DC2626',
            border: '1px solid #FECACA',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: '600',
            cursor: isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          Cancelar
        </button>
      ) : (
        <button
          onClick={() => onBook(yogaClass.id)}
          disabled={isFull || isLoading}
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: isFull ? '#F5F0E8' : '#7C6BC4',
            color: isFull ? '#9E8E82' : 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '11px',
            fontWeight: '600',
            cursor: isFull || isLoading ? 'not-allowed' : 'pointer',
          }}
        >
          {isFull ? 'Llena' : 'Reservar'}
        </button>
      )}
    </div>
  );
}
