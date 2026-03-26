import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Calendar, CreditCard, TrendingUp } from 'lucide-react';
import CreateClassButton from '@/components/admin/CreateClassButton';
import ClassManagerList from '@/components/admin/ClassManagerList';
import CoachManager from '@/components/admin/CoachManager';

export default async function AdminPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  if ((session.user as { role?: string }).role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const totalUsers = await db.user.count({
    where: { role: 'MEMBER' },
  });

  const totalBookings = await db.booking.count({
    where: { status: 'CONFIRMED' },
  });

  const totalRevenue = await db.payment.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { amount: true },
  });

  const activeMemberships = await db.userMembership.count({
    where: {
      isActive: true,
      endDate: { gte: new Date() },
    },
  });

  const recentBookings = await db.booking.findMany({
    where: { status: 'CONFIRMED' },
    include: {
      user: { select: { name: true, email: true } },
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
    orderBy: { createdAt: 'desc' },
    take: 10,
  });

  const today = new Date();
  const todayStart = new Date(today.setHours(0, 0, 0, 0));
  const todayEnd = new Date(today.setHours(23, 59, 59, 999));

  const todayClasses = await db.class.findMany({
    where: {
      startTime: { gte: todayStart, lte: todayEnd },
      status: 'SCHEDULED',
    },
    include: {
      classType: true,
      instructor: {
        include: {
          user: { select: { name: true } },
        },
      },
      bookings: {
        where: { status: 'CONFIRMED' },
      },
    },
    orderBy: { startTime: 'asc' },
  });

  const classTypes = await db.classType.findMany();
  const instructors = await db.instructor.findMany({
    include: {
      user: { select: { name: true } },
    },
  });

  // Próximas clases para gestionar
  const upcomingClasses = await db.class.findMany({
    where: {
      startTime: { gte: new Date() },
    },
    include: {
      classType: true,
      instructor: {
        include: {
          user: { select: { name: true } },
        },
      },
      bookings: {
        where: { status: 'CONFIRMED' },
        select: { id: true },
      },
    },
    orderBy: { startTime: 'asc' },
    take: 20,
  });
  const allInstructors = await db.instructor.findMany({
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
          image: true,
          bio: true,
        },
      },
      classes: {
        where: { status: 'SCHEDULED' },
        select: { id: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Panel de Administracion
            </h1>
            <p className="mt-1 text-gray-500">
              Bienvenido, {session.user.name}
            </p>
          </div>
          <CreateClassButton
            classTypes={classTypes}
            instructors={instructors}
          />
        </div>

        <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Alumnos</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {totalUsers}
                  </p>
                </div>
                <Users className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Reservas activas</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {totalBookings}
                  </p>
                </div>
                <Calendar className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Membresias activas</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {activeMemberships}
                  </p>
                </div>
                <CreditCard className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Ingresos totales</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {totalRevenue._sum.amount?.toFixed(2) || '0'}€
                  </p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Clases de hoy
            </h2>
            {todayClasses.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-400">
                  No hay clases programadas para hoy
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {todayClasses.map((yogaClass) => (
                  <Card key={yogaClass.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            {yogaClass.title}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {format(yogaClass.startTime, 'HH:mm', {
                              locale: es,
                            })}{' '}
                            · {yogaClass.instructor.user.name}
                          </p>
                        </div>
                        <div className="text-right">
                          <Badge
                            variant="secondary"
                            style={{
                              backgroundColor: yogaClass.classType.color + '20',
                              color: yogaClass.classType.color,
                            }}
                          >
                            {yogaClass.classType.name}
                          </Badge>
                          <p className="mt-1 text-sm text-gray-500">
                            {yogaClass.bookings.length}/{yogaClass.capacity}{' '}
                            plazas
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Ultimas reservas
            </h2>
            <div className="space-y-3">
              {recentBookings.map((booking) => (
                <Card key={booking.id}>
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          {booking.user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {booking.class.title} ·{' '}
                          {format(booking.class.startTime, 'd MMM · HH:mm', {
                            locale: es,
                          })}
                        </p>
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
          </div>
          {/* Gestión de clases */}
          <div className="mt-8">
            <h2 className="mb-4 text-xl font-bold text-gray-900">
              Gestionar clases proximas
            </h2>
            <ClassManagerList
              classes={upcomingClasses}
              classTypes={classTypes}
              instructors={instructors}
            />
          </div>
          {/* Gestión de coaches */}
          <div className="mt-8">
            <CoachManager instructors={allInstructors} />
          </div>
        </div>
      </div>
    </div>
  );
}
