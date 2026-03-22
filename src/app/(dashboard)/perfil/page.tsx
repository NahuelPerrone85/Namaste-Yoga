import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';
import Link from 'next/link';
import EditProfileForm from '@/components/profile/EditProfileForm';

export default async function PerfilPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  const userId = session.user.id as string;

  const user = await db.user.findUnique({
    where: { id: userId },
    include: {
      memberships: {
        include: { membership: true },
        orderBy: { createdAt: 'desc' },
        take: 3,
      },
    },
  });

  const pastBookings = await db.booking.findMany({
    where: {
      userId,
      status: 'CONFIRMED',
      class: {
        startTime: { lt: new Date() },
      },
    },
    include: {
      class: {
        include: {
          classType: true,
          instructor: {
            include: {
              user: { select: { name: true } },
            },
          },
        },
      },
    },
    orderBy: { class: { startTime: 'desc' } },
    take: 10,
  });

  const totalClasses = await db.booking.count({
    where: {
      userId,
      status: 'CONFIRMED',
    },
  });

  const activeMembership = user?.memberships.find(
    (m) => m.isActive && m.endDate >= new Date()
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Mi Perfil</h1>
          <p className="mt-1 text-gray-500">Tu informacion y historial</p>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <div className="mb-4 flex flex-col items-center text-center">
                  {user?.image ? (
                    <img
                      src={user.image}
                      alt={user.name || 'Foto de perfil'}
                      className="mb-3 h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-full bg-purple-100 text-3xl font-bold text-purple-600">
                      {session.user.name?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <h2 className="text-xl font-bold text-gray-900">
                    {user?.name}
                  </h2>
                  <p className="text-sm text-gray-500">{user?.email}</p>
                  <Badge className="mt-2" variant="secondary">
                    {(session.user as { role?: string }).role === 'ADMIN'
                      ? 'Administrador'
                      : (session.user as { role?: string }).role ===
                          'INSTRUCTOR'
                        ? 'Instructor'
                        : 'Alumno'}
                  </Badge>
                  {user?.bio && (
                    <p className="mt-3 text-center text-sm text-gray-600">
                      {user.bio}
                    </p>
                  )}
                </div>
                <div className="border-t pt-4">
                  <p className="text-center text-xs text-gray-400">
                    Miembro desde{' '}
                    {user?.createdAt
                      ? format(user.createdAt, "MMMM 'de' yyyy", { locale: es })
                      : ''}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Formulario de edicion */}
            <EditProfileForm
              user={{
                name: user?.name || null,
                email: user?.email || null,
                bio: user?.bio || null,
                image: user?.image || null,
              }}
            />

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold text-gray-900">
                  Mis estadisticas
                </h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Total clases</span>
                    <span className="font-bold text-purple-600">
                      {totalClasses}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                      Clases asistidas
                    </span>
                    <span className="font-bold text-purple-600">
                      {pastBookings.length}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <h3 className="mb-4 font-semibold text-gray-900">
                  Membresia actual
                </h3>
                {activeMembership ? (
                  <div>
                    <p className="text-lg font-bold text-purple-600">
                      {activeMembership.membership.name}
                    </p>
                    <p className="mt-1 text-sm text-gray-500">
                      Expira:{' '}
                      {format(activeMembership.endDate, "d 'de' MMMM yyyy", {
                        locale: es,
                      })}
                    </p>
                    {activeMembership.membership.classLimit && (
                      <p className="mt-1 text-sm text-gray-500">
                        Clases usadas: {activeMembership.classesUsed}/
                        {activeMembership.membership.classLimit}
                      </p>
                    )}
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-gray-400">
                      Sin membresia activa
                    </p>
                    <Link
                      href="/precios"
                      className="mt-2 inline-block text-sm font-medium text-purple-600 hover:underline"
                    >
                      Ver planes
                    </Link>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Historial de clases
            </h2>
            {pastBookings.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-400">
                    Todavia no has asistido a ninguna clase
                  </p>
                  <Link
                    href="/clases"
                    className="mt-3 inline-block rounded-lg bg-purple-600 px-6 py-2 text-white hover:bg-purple-700"
                  >
                    Reservar una clase
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {pastBookings.map((booking) => (
                  <Card key={booking.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="rounded-lg bg-gray-100 p-3">
                            <Calendar className="h-5 w-5 text-gray-400" />
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
                                  'EEEE d MMM yyyy HH:mm',
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
                            backgroundColor:
                              booking.class.classType.color + '20',
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
    </div>
  );
}
