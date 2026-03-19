import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Calendar, Clock, User } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  // Obtener próximas reservas del usuario
  const upcomingBookings = await db.booking.findMany({
    where: {
      userId: session.user.id,
      status: 'CONFIRMED',
      class: {
        startTime: { gte: new Date() },
      },
    },
    include: {
      class: {
        include: {
          instructor: {
            include: {
              user: { select: { name: true } },
            },
          },
          classType: true,
        },
      },
    },
    orderBy: { class: { startTime: 'asc' } },
    take: 5,
  });

  // Obtener membresía activa
  const activeMembership = await db.userMembership.findFirst({
    where: {
      userId: session.user.id,
      isActive: true,
      endDate: { gte: new Date() },
    },
    include: { membership: true },
  });

  // Total de reservas
  const totalBookings = await db.booking.count({
    where: {
      userId: session.user.id,
      status: 'CONFIRMED',
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            🧘 Bienvenido, {session.user?.name}!
          </h1>
          <p className="mt-1 text-gray-500">Panel de control de Namaste Yoga</p>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3">
          <Card>
            <CardContent className="p-6">
              <h2 className="mb-1 text-sm font-medium text-gray-500">
                Total reservas
              </h2>
              <p className="text-3xl font-bold text-purple-600">
                {totalBookings}
              </p>
              <p className="mt-1 text-sm text-gray-400">clases reservadas</p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-1 text-sm font-medium text-gray-500">
                Membresía
              </h2>
              <p className="text-xl font-bold text-purple-600">
                {activeMembership ? activeMembership.membership.name : '—'}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {activeMembership
                  ? `Expira: ${format(activeMembership.endDate, 'd MMM yyyy', { locale: es })}`
                  : 'Sin membresía activa'}
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <h2 className="mb-1 text-sm font-medium text-gray-500">
                Próxima clase
              </h2>
              <p className="text-xl font-bold text-purple-600">
                {upcomingBookings[0]
                  ? format(
                      new Date(upcomingBookings[0].class.startTime),
                      'd MMM',
                      { locale: es }
                    )
                  : '—'}
              </p>
              <p className="mt-1 text-sm text-gray-400">
                {upcomingBookings[0]
                  ? upcomingBookings[0].class.title
                  : 'Sin clases próximas'}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Próximas clases */}
        <div className="mb-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900">Próximas clases</h2>
            <Link
              href="/clases"
              className="text-sm font-medium text-purple-600 hover:underline"
            >
              Ver calendario →
            </Link>
          </div>

          {upcomingBookings.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <p className="mb-4 text-gray-400">
                  No tienes clases reservadas próximamente
                </p>
                <Link
                  href="/clases"
                  className="rounded-lg bg-purple-600 px-6 py-2 text-white transition hover:bg-purple-700"
                >
                  Reservar una clase
                </Link>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="rounded-lg bg-purple-100 p-3">
                          <Calendar className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {booking.class.title}
                          </h3>
                          <div className="mt-1 flex items-center gap-3">
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              {format(
                                new Date(booking.class.startTime),
                                'EEEE d MMM · HH:mm',
                                { locale: es }
                              )}
                            </span>
                            <span className="flex items-center gap-1 text-sm text-gray-500">
                              <User className="h-3 w-3" />
                              {booking.class.instructor.user.name}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Badge
                        variant="secondary"
                        style={{
                          backgroundColor: booking.class.classType.color + '20',
                          color: booking.class.classType.color,
                        }}
                      >
                        {booking.class.classType.name}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
