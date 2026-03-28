import { auth } from '@/lib/auth';
import { redirect, notFound } from 'next/navigation';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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

  const totalClasses = await db.class.count({
    where: { instructorId: id, status: 'COMPLETED' },
  });

  const totalStudents = await db.booking.findMany({
    where: {
      class: { instructorId: id },
      status: 'CONFIRMED',
    },
    select: { userId: true },
    distinct: ['userId'],
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FDFAF5',
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Back */}
        <Link
          href="/instructores"
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '13px',
            color: '#9E8E82',
            textDecoration: 'none',
            marginBottom: '24px',
            fontWeight: '500',
          }}
        >
          ← Volver a instructores
        </Link>

        {/* Hero perfil */}
        <div
          style={{
            backgroundColor: '#EDE9F8',
            borderRadius: '24px',
            padding: '40px',
            marginBottom: '24px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '180px',
              height: '180px',
              backgroundColor: '#7C6BC4',
              borderRadius: '50%',
              opacity: '0.1',
            }}
          ></div>
          <div
            style={{
              position: 'absolute',
              bottom: '-50px',
              left: '-20px',
              width: '140px',
              height: '140px',
              backgroundColor: '#8FAF8F',
              borderRadius: '50%',
              opacity: '0.15',
            }}
          ></div>

          <div
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '28px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {instructor.user.image ? (
              <img
                src={instructor.user.image}
                alt={instructor.user.name || ''}
                style={{
                  width: '100px',
                  height: '100px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  flexShrink: 0,
                  border: '4px solid white',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              />
            ) : (
              <div
                style={{
                  width: '100px',
                  height: '100px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '36px',
                  fontWeight: '700',
                  color: '#7C6BC4',
                  flexShrink: 0,
                  boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                }}
              >
                {instructor.user.name?.charAt(0).toUpperCase()}
              </div>
            )}

            <div style={{ flex: 1 }}>
              <h1
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#3D3530',
                  letterSpacing: '-0.5px',
                  marginBottom: '4px',
                }}
              >
                {instructor.user.name}
              </h1>
              <p
                style={{
                  fontSize: '14px',
                  color: '#7C6BC4',
                  fontWeight: '500',
                  marginBottom: '16px',
                }}
              >
                Instructor certificado · Shanti Centro de Yoga
              </p>

              {instructor.specialty.length > 0 && (
                <div
                  style={{
                    display: 'flex',
                    flexWrap: 'wrap',
                    gap: '8px',
                    marginBottom: '16px',
                  }}
                >
                  {instructor.specialty.map((spec) => (
                    <span
                      key={spec}
                      style={{
                        fontSize: '12px',
                        fontWeight: '500',
                        color: '#7C6BC4',
                        backgroundColor: 'white',
                        padding: '4px 12px',
                        borderRadius: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      }}
                    >
                      {spec}
                    </span>
                  ))}
                </div>
              )}

              {instructor.user.bio && (
                <p
                  style={{
                    fontSize: '14px',
                    color: '#6B5B4E',
                    lineHeight: '1.7',
                  }}
                >
                  {instructor.user.bio}
                </p>
              )}
            </div>
          </div>

          {/* Stats */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '16px',
              marginTop: '32px',
              position: 'relative',
              zIndex: 1,
            }}
          >
            {[
              { num: totalClasses, label: 'Clases impartidas' },
              { num: totalStudents.length, label: 'Alumnos únicos' },
              { num: instructor.classes.length, label: 'Próximas clases' },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '14px',
                  padding: '16px',
                  textAlign: 'center',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                }}
              >
                <p
                  style={{
                    fontSize: '28px',
                    fontWeight: '700',
                    color: '#7C6BC4',
                    lineHeight: '1',
                    marginBottom: '4px',
                  }}
                >
                  {stat.num}
                </p>
                <p style={{ fontSize: '12px', color: '#9E8E82' }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Próximas clases */}
        <div>
          <h2
            style={{
              fontSize: '20px',
              fontWeight: '700',
              color: '#3D3530',
              marginBottom: '16px',
            }}
          >
            Próximas clases
          </h2>

          {instructor.classes.length === 0 ? (
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '48px',
                textAlign: 'center',
                border: '1px solid #EDE8E0',
              }}
            >
              <span
                style={{
                  fontSize: '32px',
                  display: 'block',
                  marginBottom: '12px',
                }}
              >
                🗓️
              </span>
              <p style={{ color: '#9E8E82', fontSize: '14px' }}>
                No hay clases programadas próximamente
              </p>
            </div>
          ) : (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {instructor.classes.map((yogaClass) => {
                const spotsLeft =
                  yogaClass.capacity - yogaClass.bookings.length;

                return (
                  <div
                    key={yogaClass.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '16px',
                      padding: '20px',
                      border: '1px solid #EDE8E0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '16px',
                      }}
                    >
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: yogaClass.classType.color + '20',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '22px',
                        }}
                      >
                        {yogaClass.classType.name.includes('Hatha')
                          ? '🧘'
                          : yogaClass.classType.name.includes('Vinyasa')
                            ? '🌊'
                            : '🌙'}
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: '15px',
                            fontWeight: '600',
                            color: '#3D3530',
                            marginBottom: '2px',
                          }}
                        >
                          {yogaClass.title}
                        </p>
                        <p style={{ fontSize: '13px', color: '#9E8E82' }}>
                          {format(
                            new Date(yogaClass.startTime),
                            'EEEE d MMM · HH:mm',
                            { locale: es }
                          )}
                          {' · '}
                          <span
                            style={{
                              color:
                                spotsLeft === 0
                                  ? '#DC2626'
                                  : spotsLeft <= 3
                                    ? '#D97706'
                                    : '#8FAF8F',
                              fontWeight: '500',
                            }}
                          >
                            {spotsLeft === 0 ? 'Llena' : `${spotsLeft} plazas`}
                          </span>
                        </p>
                      </div>
                    </div>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                    >
                      <span
                        style={{
                          fontSize: '12px',
                          fontWeight: '500',
                          color: yogaClass.classType.color,
                          backgroundColor: yogaClass.classType.color + '20',
                          padding: '4px 12px',
                          borderRadius: '20px',
                        }}
                      >
                        {yogaClass.classType.name}
                      </span>
                      <Link
                        href="/clases"
                        style={{
                          backgroundColor: '#7C6BC4',
                          color: 'white',
                          borderRadius: '10px',
                          padding: '10px 20px',
                          fontSize: '13px',
                          fontWeight: '600',
                          textDecoration: 'none',
                        }}
                      >
                        Reservar
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
