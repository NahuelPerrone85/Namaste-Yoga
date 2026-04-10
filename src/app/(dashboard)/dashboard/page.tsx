import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import Link from 'next/link';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default async function DashboardPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  const userId = session.user.id as string;

  const upcomingBookings = await db.booking.findMany({
    where: {
      userId,
      status: 'CONFIRMED',
      class: {
        startTime: { gte: new Date() },
        status: 'SCHEDULED',
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

  const activeMembership = await db.userMembership.findFirst({
    where: {
      userId,
      isActive: true,
      endDate: { gte: new Date() },
    },
    include: { membership: true },
  });

  const totalBookings = await db.booking.count({
    where: {
      userId,
      status: 'CONFIRMED',
      class: { startTime: { gte: new Date() } },
    },
  });

  const totalPastClasses = await db.booking.count({
    where: {
      userId,
      status: 'CONFIRMED',
      class: { startTime: { lt: new Date() } },
    },
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FDFAF5',
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '40px' }}>
          <p
            style={{ fontSize: '13px', color: '#9E8E82', marginBottom: '4px' }}
          >
            {format(new Date(), "EEEE, d 'de' MMMM", { locale: es })}
          </p>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#3D3530',
              letterSpacing: '-0.5px',
            }}
          >
            Hola, {session.user?.name?.split(' ')[0]} 🙏
          </h1>
        </div>

        {/* Stats */}
        <div className="grid-3" style={{ marginBottom: '40px' }}>
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #EDE8E0',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                color: '#9E8E82',
                fontWeight: '500',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              PRÓXIMAS CLASES
            </p>
            <p
              style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#7C6BC4',
                lineHeight: '1',
                marginBottom: '4px',
              }}
            >
              {totalBookings}
            </p>
            <p style={{ fontSize: '13px', color: '#9E8E82' }}>reservadas</p>
          </div>

          <div
            style={{
              backgroundColor: '#EDE9F8',
              borderRadius: '16px',
              padding: '24px',
              border: 'none',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                color: '#7C6BC4',
                fontWeight: '500',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              MEMBRESÍA
            </p>
            <p
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#3D3530',
                lineHeight: '1.2',
                marginBottom: '4px',
              }}
            >
              {activeMembership ? activeMembership.membership.name : 'Sin plan'}
            </p>
            <p style={{ fontSize: '13px', color: '#7C6BC4' }}>
              {activeMembership ? (
                `Expira ${format(activeMembership.endDate, 'd MMM yyyy', { locale: es })}`
              ) : (
                <Link
                  href="/precios"
                  style={{
                    color: '#7C6BC4',
                    fontWeight: '600',
                    textDecoration: 'none',
                  }}
                >
                  Ver planes →
                </Link>
              )}
            </p>
          </div>

          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              border: '1px solid #EDE8E0',
            }}
          >
            <p
              style={{
                fontSize: '12px',
                color: '#9E8E82',
                fontWeight: '500',
                letterSpacing: '0.5px',
                marginBottom: '8px',
              }}
            >
              CLASES ASISTIDAS
            </p>
            <p
              style={{
                fontSize: '36px',
                fontWeight: '700',
                color: '#8FAF8F',
                lineHeight: '1',
                marginBottom: '4px',
              }}
            >
              {totalPastClasses}
            </p>
            <p style={{ fontSize: '13px', color: '#9E8E82' }}>en total</p>
          </div>
        </div>

        <div className="grid-dashboard">
          {/* Próximas clases */}
          <div>
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <h2
                style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#3D3530',
                }}
              >
                Mis próximas clases
              </h2>
              <Link
                href="/clases"
                style={{
                  fontSize: '13px',
                  color: '#7C6BC4',
                  fontWeight: '500',
                  textDecoration: 'none',
                }}
              >
                Ver calendario →
              </Link>
            </div>

            {upcomingBookings.length === 0 ? (
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
                    fontSize: '40px',
                    display: 'block',
                    marginBottom: '16px',
                  }}
                >
                  🧘
                </span>
                <p
                  style={{
                    fontSize: '15px',
                    fontWeight: '500',
                    color: '#3D3530',
                    marginBottom: '8px',
                  }}
                >
                  No tienes clases reservadas
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#9E8E82',
                    marginBottom: '24px',
                  }}
                >
                  Explora el calendario y reserva tu próxima práctica
                </p>
                <Link
                  href="/clases"
                  style={{
                    display: 'inline-block',
                    backgroundColor: '#7C6BC4',
                    color: 'white',
                    borderRadius: '10px',
                    padding: '12px 24px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textDecoration: 'none',
                  }}
                >
                  Ver clases disponibles
                </Link>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px',
                }}
              >
                {upcomingBookings.map(
                  (booking: (typeof upcomingBookings)[0]) => {
                    const twoHoursBefore = new Date(booking.class.startTime);
                    twoHoursBefore.setHours(twoHoursBefore.getHours() - 2);
                    const canCancel = new Date() < twoHoursBefore;
                    const isToday =
                      format(
                        new Date(booking.class.startTime),
                        'yyyy-MM-dd'
                      ) === format(new Date(), 'yyyy-MM-dd');

                    return (
                      <div
                        key={booking.id}
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
                              backgroundColor:
                                booking.class.classType.color + '20',
                              borderRadius: '12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              fontSize: '22px',
                              flexShrink: 0,
                            }}
                          >
                            {booking.class.classType.name.includes('Hatha')
                              ? '🧘'
                              : booking.class.classType.name.includes('Vinyasa')
                                ? '🌊'
                                : '🌙'}
                          </div>
                          <div>
                            <div
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px',
                                marginBottom: '2px',
                              }}
                            >
                              <p
                                style={{
                                  fontSize: '15px',
                                  fontWeight: '600',
                                  color: '#3D3530',
                                  margin: 0,
                                }}
                              >
                                {booking.class.title}
                              </p>
                              {isToday && (
                                <span
                                  style={{
                                    fontSize: '10px',
                                    fontWeight: '600',
                                    color: '#7C6BC4',
                                    backgroundColor: '#EDE9F8',
                                    padding: '2px 8px',
                                    borderRadius: '20px',
                                  }}
                                >
                                  HOY
                                </span>
                              )}
                            </div>
                            <p
                              style={{
                                fontSize: '13px',
                                color: '#9E8E82',
                                margin: 0,
                              }}
                            >
                              {format(
                                new Date(booking.class.startTime),
                                'EEEE d MMM · HH:mm',
                                { locale: es }
                              )}{' '}
                              · {booking.class.instructor.user.name}
                            </p>
                          </div>
                        </div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '8px',
                          }}
                        >
                          <span
                            style={{
                              fontSize: '11px',
                              fontWeight: '500',
                              color: booking.class.classType.color,
                              backgroundColor:
                                booking.class.classType.color + '20',
                              padding: '4px 10px',
                              borderRadius: '20px',
                            }}
                          >
                            {booking.class.classType.name}
                          </span>
                          {canCancel && (
                            <Link
                              href={`/clases?cancelar=${booking.id}`}
                              style={{
                                fontSize: '12px',
                                color: '#DC2626',
                                textDecoration: 'none',
                                fontWeight: '500',
                              }}
                            >
                              Cancelar
                            </Link>
                          )}
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            )}
          </div>

          {/* Panel lateral */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Membresía card */}
            <div
              style={{
                backgroundColor: '#7C6BC4',
                borderRadius: '20px',
                padding: '24px',
                color: 'white',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  position: 'absolute',
                  top: '-20px',
                  right: '-20px',
                  width: '100px',
                  height: '100px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  opacity: '0.08',
                }}
              ></div>
              <div
                style={{
                  position: 'absolute',
                  bottom: '-30px',
                  left: '-10px',
                  width: '80px',
                  height: '80px',
                  backgroundColor: 'white',
                  borderRadius: '50%',
                  opacity: '0.06',
                }}
              ></div>
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  letterSpacing: '1px',
                  opacity: '0.7',
                  marginBottom: '8px',
                }}
              >
                TU MEMBRESÍA
              </p>
              <p
                style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  marginBottom: '4px',
                }}
              >
                {activeMembership
                  ? activeMembership.membership.name
                  : 'Sin plan activo'}
              </p>
              {activeMembership ? (
                <>
                  <p
                    style={{
                      fontSize: '12px',
                      opacity: '0.7',
                      marginBottom: '16px',
                    }}
                  >
                    Válida hasta{' '}
                    {format(activeMembership.endDate, "d 'de' MMMM yyyy", {
                      locale: es,
                    })}
                  </p>
                  {activeMembership.membership.classLimit && (
                    <>
                      <div
                        style={{
                          height: '4px',
                          backgroundColor: 'rgba(255,255,255,0.2)',
                          borderRadius: '2px',
                          marginBottom: '6px',
                          overflow: 'hidden',
                        }}
                      >
                        <div
                          style={{
                            height: '100%',
                            width: `${(activeMembership.classesUsed / activeMembership.membership.classLimit) * 100}%`,
                            backgroundColor: 'white',
                            borderRadius: '2px',
                          }}
                        ></div>
                      </div>
                      <p style={{ fontSize: '11px', opacity: '0.7' }}>
                        {activeMembership.classesUsed}/
                        {activeMembership.membership.classLimit} clases usadas
                      </p>
                    </>
                  )}
                </>
              ) : (
                <Link
                  href="/precios"
                  style={{
                    display: 'inline-block',
                    marginTop: '12px',
                    backgroundColor: 'white',
                    color: '#7C6BC4',
                    borderRadius: '8px',
                    padding: '10px 20px',
                    fontSize: '13px',
                    fontWeight: '600',
                    textDecoration: 'none',
                  }}
                >
                  Ver planes
                </Link>
              )}
            </div>

            {/* Accesos rápidos */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '20px',
                border: '1px solid #EDE8E0',
              }}
            >
              <p
                style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: '#3D3530',
                  marginBottom: '14px',
                }}
              >
                Accesos rápidos
              </p>
              <div
                style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}
              >
                {[
                  { href: '/clases', label: 'Reservar una clase', emoji: '📅' },
                  {
                    href: '/instructores',
                    label: 'Ver instructores',
                    emoji: '🧘',
                  },
                  { href: '/perfil', label: 'Mi perfil', emoji: '👤' },
                  { href: '/precios', label: 'Cambiar membresía', emoji: '✨' },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 12px',
                      borderRadius: '10px',
                      backgroundColor: '#FDFAF5',
                      textDecoration: 'none',
                      transition: 'background 0.15s',
                    }}
                  >
                    <span style={{ fontSize: '16px' }}>{item.emoji}</span>
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#6B5B4E',
                        fontWeight: '500',
                      }}
                    >
                      {item.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
