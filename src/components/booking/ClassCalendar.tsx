'use client';

import { useState, useEffect } from 'react';
import { format, addDays, startOfWeek } from 'date-fns';
import { es } from 'date-fns/locale';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      <div className="mb-6 flex items-center justify-between">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeekStart(addDays(currentWeekStart, -7))}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <h2 className="text-lg font-semibold text-gray-700">
          {format(currentWeekStart, "d 'de' MMMM", { locale: es })} —{' '}
          {format(addDays(currentWeekStart, 6), "d 'de' MMMM yyyy", {
            locale: es,
          })}
        </h2>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setCurrentWeekStart(addDays(currentWeekStart, 7))}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>

      {/* Grid semanal */}
      {loading ? (
        <div className="py-12 text-center text-gray-400">
          Cargando clases...
        </div>
      ) : (
        <div className="grid grid-cols-7 gap-3">
          {weekDays.map((day) => {
            const dayClasses = getClassesForDay(day);
            const isToday =
              format(day, 'yyyy-MM-dd') === format(new Date(), 'yyyy-MM-dd');

            return (
              <div key={day.toISOString()}>
                {/* Header día */}
                <div
                  className={`mb-2 rounded-lg p-2 text-center ${
                    isToday ? 'bg-purple-600 text-white' : 'text-gray-500'
                  }`}
                >
                  <p className="text-xs font-medium uppercase">
                    {format(day, 'EEE', { locale: es })}
                  </p>
                  <p className="text-lg font-bold">{format(day, 'd')}</p>
                </div>

                {/* Clases del día */}
                <div className="space-y-2">
                  {dayClasses.length === 0 ? (
                    <p className="py-4 text-center text-xs text-gray-300">
                      Sin clases
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
