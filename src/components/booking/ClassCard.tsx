'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
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
  const endTime = format(new Date(yogaClass.endTime), 'HH:mm', {
    locale: es,
  });
  const duration =
    (new Date(yogaClass.endTime).getTime() -
      new Date(yogaClass.startTime).getTime()) /
    60000;

  return (
    <Card className="transition-shadow hover:shadow-md">
      <CardContent className="p-4">
        <div className="mb-3 flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-gray-900">{yogaClass.title}</h3>
            <Badge
              variant="secondary"
              className="mt-1 text-xs"
              style={{
                backgroundColor: yogaClass.classType.color + '20',
                color: yogaClass.classType.color,
              }}
            >
              {yogaClass.classType.name}
            </Badge>
          </div>
          {isBooked && (
            <Badge className="border-green-200 bg-green-100 text-green-700">
              ✓ Reservado
            </Badge>
          )}
        </div>

        <div className="mb-4 space-y-1">
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="h-4 w-4" />
            <span>
              {startTime} - {endTime} ({duration} min)
            </span>
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <User className="h-4 w-4" />
            <span>{yogaClass.instructor.user.name}</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Users className="h-4 w-4" />
            <span
              className={
                isFull
                  ? 'text-red-500'
                  : spotsLeft <= 3
                    ? 'text-amber-500'
                    : 'text-gray-500'
              }
            >
              {isFull ? 'Clase llena' : `${spotsLeft} plazas disponibles`}
            </span>
          </div>
        </div>

        {isBooked ? (
          <Button
            variant="outline"
            size="sm"
            className="w-full border-red-200 text-red-500 hover:bg-red-50"
            onClick={() => onCancel(userBooking.id)}
            disabled={isLoading}
          >
            Cancelar reserva
          </Button>
        ) : (
          <Button
            size="sm"
            className="w-full bg-purple-600 hover:bg-purple-700"
            onClick={() => onBook(yogaClass.id)}
            disabled={isFull || isLoading}
          >
            {isFull ? 'Lista de espera' : 'Reservar'}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
