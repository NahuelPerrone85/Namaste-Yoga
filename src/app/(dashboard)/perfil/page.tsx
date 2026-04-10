import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
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
      class: { startTime: { lt: new Date() } },
    },
    include: {
      class: {
        include: {
          classType: true,
          instructor: {
            include: { user: { select: { name: true } } },
          },
        },
      },
    },
    orderBy: { class: { startTime: 'desc' } },
    take: 10,
  });

  const totalClasses = await db.booking.count({
    where: { userId, status: 'CONFIRMED' },
  });

  const activeMembership = user?.memberships.find(
    (m) => m.isActive && m.endDate >= new Date()
  );

  const role = (session.user as { role?: string }).role;

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FDFAF5',
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div className="grid-sidebar">
          {/* Columna izquierda */}
          <div
            style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}
          >
            {/* Card perfil */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid #EDE8E0',
                textAlign: 'center',
              }}
            >
              {user?.image ? (
                <img
                  src={user.image}
                  alt={user.name || ''}
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    objectFit: 'cover',
                    margin: '0 auto 16px',
                    display: 'block',
                    border: '3px solid #EDE9F8',
                  }}
                />
              ) : (
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    backgroundColor: '#EDE9F8',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '32px',
                    fontWeight: '700',
                    color: '#7C6BC4',
                    margin: '0 auto 16px',
                  }}
                >
                  {user?.name?.charAt(0).toUpperCase()}
                </div>
              )}

              <h2
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#3D3530',
                  marginBottom: '4px',
                }}
              >
                {user?.name}
              </h2>
              <p
                style={{
                  fontSize: '13px',
                  color: '#9E8E82',
                  marginBottom: '12px',
                }}
              >
                {user?.email}
              </p>

              <span
                style={{
                  display: 'inline-block',
                  fontSize: '11px',
                  fontWeight: '600',
                  color: '#7C6BC4',
                  backgroundColor: '#EDE9F8',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  marginBottom: '16px',
                }}
              >
                {role === 'ADMIN'
                  ? '⚙️ Administrador'
                  : role === 'INSTRUCTOR'
                    ? '🧘 Instructor'
                    : '👤 Alumno'}
              </span>

              {user?.bio && (
                <p
                  style={{
                    fontSize: '13px',
                    color: '#6B5B4E',
                    lineHeight: '1.6',
                    marginBottom: '16px',
                  }}
                >
                  {user.bio}
                </p>
              )}

              <p style={{ fontSize: '12px', color: '#C4B8B0' }}>
                Miembro desde{' '}
                {user?.createdAt
                  ? format(user.createdAt, "MMMM 'de' yyyy", { locale: es })
                  : ''}
              </p>
            </div>

            {/* Editar perfil */}
            <EditProfileForm
              user={{
                name: user?.name || null,
                email: user?.email || null,
                bio: user?.bio || null,
                image: user?.image || null,
              }}
            />

            {/* Membresía */}
            <div
              style={{
                backgroundColor: activeMembership ? '#7C6BC4' : 'white',
                borderRadius: '20px',
                padding: '24px',
                border: activeMembership ? 'none' : '1px solid #EDE8E0',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {activeMembership && (
                <>
                  <div
                    style={{
                      position: 'absolute',
                      top: '-20px',
                      right: '-20px',
                      width: '80px',
                      height: '80px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      opacity: '0.08',
                    }}
                  ></div>
                  <div
                    style={{
                      position: 'absolute',
                      bottom: '-20px',
                      left: '-10px',
                      width: '60px',
                      height: '60px',
                      backgroundColor: 'white',
                      borderRadius: '50%',
                      opacity: '0.06',
                    }}
                  ></div>
                </>
              )}
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: '600',
                  color: activeMembership ? 'rgba(255,255,255,0.7)' : '#9E8E82',
                  letterSpacing: '0.5px',
                  marginBottom: '8px',
                }}
              >
                MEMBRESÍA
              </p>
              {activeMembership ? (
                <>
                  <p
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: 'white',
                      marginBottom: '4px',
                    }}
                  >
                    {activeMembership.membership.name}
                  </p>
                  <p
                    style={{ fontSize: '12px', color: 'rgba(255,255,255,0.7)' }}
                  >
                    Expira{' '}
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
                          margin: '12px 0 4px',
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
                      <p
                        style={{
                          fontSize: '11px',
                          color: 'rgba(255,255,255,0.6)',
                        }}
                      >
                        {activeMembership.classesUsed}/
                        {activeMembership.membership.classLimit} clases usadas
                      </p>
                    </>
                  )}
                </>
              ) : (
                <>
                  <p
                    style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#3D3530',
                      marginBottom: '4px',
                    }}
                  >
                    Sin membresía activa
                  </p>
                  <Link
                    href="/precios"
                    style={{
                      display: 'inline-block',
                      marginTop: '8px',
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#7C6BC4',
                      textDecoration: 'none',
                    }}
                  >
                    Ver planes →
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Historial */}
          <div>
            {pastBookings.length === 0 ? (
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '64px',
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
                  Aún no has asistido a ninguna clase
                </p>
                <p
                  style={{
                    fontSize: '13px',
                    color: '#9E8E82',
                    marginBottom: '24px',
                  }}
                >
                  Reserva tu primera clase y comienza tu práctica
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
                  Ver clases
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
                {pastBookings.map((booking) => (
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
                          width: '44px',
                          height: '44px',
                          backgroundColor: booking.class.classType.color + '20',
                          borderRadius: '12px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                        }}
                      >
                        {booking.class.classType.name.includes('Hatha')
                          ? '🧘'
                          : booking.class.classType.name.includes('Vinyasa')
                            ? '🌊'
                            : '🌙'}
                      </div>
                      <div>
                        <p
                          style={{
                            fontSize: '14px',
                            fontWeight: '600',
                            color: '#3D3530',
                            marginBottom: '2px',
                          }}
                        >
                          {booking.class.title}
                        </p>
                        <p style={{ fontSize: '12px', color: '#9E8E82' }}>
                          {format(
                            new Date(booking.class.startTime),
                            'EEEE d MMM yyyy · HH:mm',
                            { locale: es }
                          )}
                          {' · '}
                          {booking.class.instructor.user.name}
                        </p>
                      </div>
                    </div>
                    <span
                      style={{
                        fontSize: '11px',
                        fontWeight: '500',
                        color: booking.class.classType.color,
                        backgroundColor: booking.class.classType.color + '20',
                        padding: '4px 10px',
                        borderRadius: '20px',
                      }}
                    >
                      {booking.class.classType.name}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Stats */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '20px',
              padding: '24px',
              border: '1px solid #EDE8E0',
            }}
          >
            <p
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#3D3530',
                marginBottom: '16px',
              }}
            >
              Mis estadísticas
            </p>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '13px', color: '#9E8E82' }}>
                  Total clases
                </span>
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#7C6BC4',
                  }}
                >
                  {totalClasses}
                </span>
              </div>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span style={{ fontSize: '13px', color: '#9E8E82' }}>
                  Clases asistidas
                </span>
                <span
                  style={{
                    fontSize: '20px',
                    fontWeight: '700',
                    color: '#8FAF8F',
                  }}
                >
                  {pastBookings.length}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
