'use client';

import { useState, useEffect } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import ClassCard from './ClassCard';
import { useSession } from 'next-auth/react';

interface YogaClass {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  capacity: number;
  classType: { name: string; color: string };
  instructor: { user: { name: string | null } };
  bookings: { id: string; userId: string }[];
}

export default function ClassCalendar() {
  const { data: session } = useSession();
  const [currentWeekStart, setCurrentWeekStart] = useState(
    startOfWeek(new Date(), { weekStartsOn: 1 })
  );
  const [classes, setClasses] = useState<YogaClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    addDays(currentWeekStart, i)
  );

  const fetchClasses = async () => {
    setLoading(true);
    try {
      const startDate = currentWeekStart.toISOString();
      const endDate = addDays(currentWeekStart, 7).toISOString();
      const res = await fetch(
        `/api/classes?startDate=${startDate}&endDate=${endDate}`
      );
      const data = await res.json();
      setClasses(data);
    } catch (error) {
      console.error('Error cargando clases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, [currentWeekStart]);

  const handleBook = async (classId: string) => {
    if (!session) return;
    setActionLoading(true);
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ classId }),
      });
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 403) {
          if (confirm(`${data.error}. ¿Quieres ver los planes de membresía?`)) {
            window.location.href = '/precios';
          }
          return;
        }
        alert(data.error);
        return;
      }
      await fetchClasses();
    } catch (error) {
      console.error('Error reservando:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const handleCancel = async (bookingId: string) => {
    if (!session) return;
    setActionLoading(true);
    try {
      const res = await fetch(`/api/bookings/${bookingId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error);
        return;
      }
      await fetchClasses();
    } catch (error) {
      console.error('Error cancelando:', error);
    } finally {
      setActionLoading(false);
    }
  };

  const getClassesForDay = (day: Date) => {
    return classes.filter((c) => {
      const classDate = new Date(c.startTime);
      return (
        classDate.getDate() === day.getDate() &&
        classDate.getMonth() === day.getMonth() &&
        classDate.getFullYear() === day.getFullYear()
      );
    });
  };

  return (
    <div>
      {/* Header semana */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '16px 20px',
          border: '1px solid #EDE8E0',
        }}
      >
        <button
          onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            border: '1px solid #EDE8E0',
            backgroundColor: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6B5B4E',
          }}
        >
          <ChevronLeft size={18} />
        </button>
        <div style={{ textAlign: 'center' }}>
          <p style={{ fontSize: '16px', fontWeight: '600', color: '#3D3530' }}>
            {format(currentWeekStart, "d 'de' MMMM", { locale: es })} —{' '}
            {format(addDays(currentWeekStart, 6), "d 'de' MMMM yyyy", {
              locale: es,
            })}
          </p>
        </div>
        <button
          onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            border: '1px solid #EDE8E0',
            backgroundColor: 'white',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#6B5B4E',
          }}
        >
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Grid semanal */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '64px', color: '#9E8E82' }}>
          <span
            style={{ fontSize: '32px', display: 'block', marginBottom: '16px' }}
          >
            🪷
          </span>
          Cargando clases...
        </div>
      ) : (
        <div className="grid-7">
          {weekDays.map((day) => {
            const dayClasses = getClassesForDay(day);
            const isToday =
              format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

            return (
              <div key={day.toISOString()}>
                {/* Header día */}
                <div
                  style={{
                    textAlign: 'center',
                    marginBottom: '8px',
                    padding: '10px 6px',
                    borderRadius: '12px',
                    backgroundColor: isToday ? '#7C6BC4' : 'white',
                    border: isToday ? 'none' : '1px solid #EDE8E0',
                  }}
                >
                  <p
                    style={{
                      fontSize: '11px',
                      fontWeight: '600',
                      letterSpacing: '0.5px',
                      color: isToday ? 'rgba(255,255,255,0.8)' : '#9E8E82',
                      textTransform: 'uppercase',
                      marginBottom: '2px',
                    }}
                  >
                    {format(day, 'EEE', { locale: es })}
                  </p>
                  <p
                    style={{
                      fontSize: '20px',
                      fontWeight: '700',
                      color: isToday ? 'white' : '#3D3530',
                      lineHeight: '1',
                    }}
                  >
                    {format(day, 'd')}
                  </p>
                </div>

                {/* Clases del día */}
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {dayClasses.length === 0 ? (
                    <p
                      style={{
                        fontSize: '11px',
                        color: '#C4B8B0',
                        textAlign: 'center',
                        padding: '16px 0',
                      }}
                    >
                      —
                    </p>
                  ) : (
                    dayClasses.map((yogaClass) => (
                      <ClassCard
                        key={yogaClass.id}
                        yogaClass={yogaClass}
                        currentUserId={session?.user?.id}
                        onBook={handleBook}
                        onCancel={handleCancel}
                        isLoading={actionLoading}
                      />
                    ))
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
