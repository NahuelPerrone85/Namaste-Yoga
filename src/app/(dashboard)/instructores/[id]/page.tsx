import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, Users } from 'lucide-react';
import Link from 'next/link';

export default async function InstructorProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  const { id } = await params;

  const instructor = await db.instructor.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
          image: true,
          bio: true,
          createdAt: true,
        },
      },
      classes: {
        where: {
          status: 'SCHEDULED',
          startTime: { gte: new Date() },
        },
        include: {
          classType: true,
          bookings: {
            where: { status: 'CONFIRMED' },
            select: { id: true },
          },
        },
        orderBy: { startTime: 'asc' },
        take: 10,
      },
    },
  });

  if (!instructor) {
    notFound();
  }

  // Total clases impartidas
  const totalClasses = await db.class.count({
    where: {
      instructorId: id,
      status: 'COMPLETED',
    },
  });

  // Total alumnos únicos
  const totalStudents = await db.booking.findMany({
    where: {
      class: { instructorId: id },
      status: 'CONFIRMED',
    },
    select: { userId: true },
    distinct: ['userId'],
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        {/* Header perfil */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              {instructor.user.image ? (
                <img
                  src={instructor.user.image}
                  alt={instructor.user.name || 'Instructor'}
                  className="h-24 w-24 flex-shrink-0 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-4xl font-bold text-purple-600">
                  {instructor.user.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900">
                  {instructor.user.name}
                </h1>
                <p className="mt-1 text-gray-500">Instructor de Yoga</p>

                {/* Especialidades */}
                {instructor.specialty.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {instructor.specialty.map((spec) => (
                      <Badge
                        key={spec}
                        variant="secondary"
                        className="bg-purple-100 text-purple-700"
                      >
                        {spec}
                      </Badge>
                    ))}
                  </div>
                )}

                {/* Bio */}
                {instructor.user.bio && (
                  <p className="mt-4 leading-relaxed text-gray-600">
                    {instructor.user.bio}
                  </p>
                )}

                {/* Stats */}
                <div className="mt-6 grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {totalClasses}
                    </p>
                    <p className="text-sm text-gray-500">Clases impartidas</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {totalStudents.length}
                    </p>
                    <p className="text-sm text-gray-500">Alumnos</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold text-purple-600">
                      {instructor.classes.length}
                    </p>
                    <p className="text-sm text-gray-500">Proximas clases</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Próximas clases */}
        <div>
          <h2 className="mb-4 text-xl font-bold text-gray-900">
            Proximas clases
          </h2>

          {instructor.classes.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center text-gray-400">
                No hay clases programadas proximas
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {instructor.classes.map((yogaClass) => {
                const spotsLeft =
                  yogaClass.capacity - yogaClass.bookings.length;

                return (
                  <Card
                    key={yogaClass.id}
                    className="transition-shadow hover:shadow-md"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="rounded-lg bg-purple-100 p-3">
                            <Calendar className="h-5 w-5 text-purple-600" />
                          </div>
                          <div>
                            <h3 className="font-semibold text-gray-900">
                              {yogaClass.title}
                            </h3>
                            <div className="mt-1 flex items-center gap-3">
                              <span className="flex items-center gap-1 text-sm text-gray-500">
                                <Clock className="h-3 w-3" />
                                {format(
                                  new Date(yogaClass.startTime),
                                  'EEEE d MMM · HH:mm',
                                  { locale: es }
                                )}
                              </span>
                              <span className="flex items-center gap-1 text-sm text-gray-500">
                                <Users className="h-3 w-3" />
                                <span
                                  className={
                                    spotsLeft === 0
                                      ? 'text-red-500'
                                      : spotsLeft <= 3
                                        ? 'text-amber-500'
                                        : 'text-gray-500'
                                  }
                                >
                                  {spotsLeft === 0
                                    ? 'Llena'
                                    : `${spotsLeft} plazas`}
                                </span>
                              </span>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Badge
                            variant="secondary"
                            style={{
                              backgroundColor: yogaClass.classType.color + '20',
                              color: yogaClass.classType.color,
                            }}
                          >
                            {yogaClass.classType.name}
                          </Badge>
                          <Link
                            href="/clases"
                            className="rounded-lg bg-purple-600 px-4 py-2 text-sm text-white transition hover:bg-purple-700"
                          >
                            Reservar
                          </Link>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
