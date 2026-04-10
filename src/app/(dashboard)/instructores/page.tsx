import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
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
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#3D3530',
              letterSpacing: '-0.5px',
              marginBottom: '8px',
            }}
          >
            Nuestros instructores 🧘
          </h1>
          <p style={{ fontSize: '15px', color: '#9E8E82' }}>
            Conoce al equipo de profesionales certificados de Shanti
          </p>
        </div>

        <div className="grid-2">
          {instructors.map((instructor) => (
            <Link
              key={instructor.id}
              href={`/instructores/${instructor.id}`}
              style={{ textDecoration: 'none' }}
            >
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  padding: '28px',
                  border: '1px solid #EDE8E0',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '20px',
                }}
              >
                {/* Avatar */}
                {instructor.user.image ? (
                  <img
                    src={instructor.user.image}
                    alt={instructor.user.name || 'Instructor'}
                    style={{
                      width: '72px',
                      height: '72px',
                      borderRadius: '50%',
                      objectFit: 'cover',
                      flexShrink: 0,
                    }}
                  />
                ) : (
                  <div
                    style={{
                      width: '72px',
                      height: '72px',
                      backgroundColor: '#EDE9F8',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '28px',
                      fontWeight: '700',
                      color: '#7C6BC4',
                      flexShrink: 0,
                    }}
                  >
                    {instructor.user.name?.charAt(0).toUpperCase()}
                  </div>
                )}

                <div style={{ flex: 1 }}>
                  <h2
                    style={{
                      fontSize: '18px',
                      fontWeight: '700',
                      color: '#3D3530',
                      marginBottom: '4px',
                    }}
                  >
                    {instructor.user.name}
                  </h2>
                  <p
                    style={{
                      fontSize: '13px',
                      color: '#9E8E82',
                      marginBottom: '12px',
                    }}
                  >
                    Instructor certificado · Shanti
                  </p>

                  {/* Especialidades */}
                  {instructor.specialty.length > 0 && (
                    <div
                      style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '6px',
                        marginBottom: '12px',
                      }}
                    >
                      {instructor.specialty.slice(0, 3).map((spec) => (
                        <span
                          key={spec}
                          style={{
                            fontSize: '11px',
                            fontWeight: '500',
                            color: '#7C6BC4',
                            backgroundColor: '#EDE9F8',
                            padding: '3px 10px',
                            borderRadius: '20px',
                          }}
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Bio preview */}
                  {instructor.user.bio && (
                    <p
                      style={{
                        fontSize: '13px',
                        color: '#6B5B4E',
                        lineHeight: '1.6',
                        marginBottom: '14px',
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden',
                      }}
                    >
                      {instructor.user.bio}
                    </p>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#7C6BC4',
                        fontWeight: '600',
                      }}
                    >
                      {instructor.classes.length} clases próximas
                    </span>
                    <span
                      style={{
                        fontSize: '13px',
                        color: '#7C6BC4',
                        fontWeight: '600',
                      }}
                    >
                      Ver perfil →
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
