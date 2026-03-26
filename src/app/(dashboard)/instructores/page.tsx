import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Link from 'next/link';

export default async function InstructoresPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  const instructors = await db.instructor.findMany({
    include: {
      user: {
        select: {
          name: true,
          image: true,
          bio: true,
        },
      },
      classes: {
        where: {
          status: 'SCHEDULED',
          startTime: { gte: new Date() },
        },
        select: { id: true },
      },
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Nuestros Instructores
          </h1>
          <p className="mt-1 text-gray-500">
            Conoce a nuestro equipo de profesionales
          </p>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {instructors.map((instructor) => (
            <Link key={instructor.id} href={`/instructores/${instructor.id}`}>
              <Card className="h-full cursor-pointer transition-shadow hover:shadow-md">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    {instructor.user.image ? (
                      <img
                        src={instructor.user.image}
                        alt={instructor.user.name || 'Instructor'}
                        className="h-16 w-16 flex-shrink-0 rounded-full object-cover"
                      />
                    ) : (
                      <div className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-full bg-purple-100 text-2xl font-bold text-purple-600">
                        {instructor.user.name?.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="flex-1">
                      <h2 className="text-lg font-bold text-gray-900">
                        {instructor.user.name}
                      </h2>
                      <p className="mb-2 text-sm text-gray-500">
                        Instructor de Yoga
                      </p>

                      {instructor.specialty.length > 0 && (
                        <div className="mb-3 flex flex-wrap gap-1">
                          {instructor.specialty.slice(0, 3).map((spec) => (
                            <Badge
                              key={spec}
                              variant="secondary"
                              className="bg-purple-100 text-xs text-purple-700"
                            >
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      )}

                      {instructor.user.bio && (
                        <p className="line-clamp-2 text-sm text-gray-600">
                          {instructor.user.bio}
                        </p>
                      )}

                      <p className="mt-3 text-sm font-medium text-purple-600">
                        {instructor.classes.length} clases proximas
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
