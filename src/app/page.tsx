import Link from 'next/link';

export default function HomePage() {
  return (
    <div
      style={{
        backgroundColor: '#FDFAF5',
        minHeight: '100vh',
        fontFamily: 'var(--font-geist-sans), system-ui, sans-serif',
      }}
    >
      <style>{`
        @media (max-width: 768px) {
          .home-nav-desktop { display: none !important; }
          .home-nav-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .home-nav-mobile { display: none !important; }
          .home-nav-desktop { display: flex !important; }
        }
      `}</style>
      {/* NAVBAR */}
      <nav
        style={{
          position: 'sticky',
          top: 0,
          zIndex: 50,
          backgroundColor: 'rgba(253,250,245,0.92)',
          backdropFilter: 'blur(12px)',
          borderBottom: '1px solid #EDE8E0',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 16px',
            height: '64px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: '12px',
          }}
        >
          {/* Logo */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#EDE9F8',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '16px',
              }}
            >
              🪷
            </div>
            <div>
              <span
                style={{
                  fontSize: '15px',
                  fontWeight: '600',
                  color: '#3D3530',
                  letterSpacing: '-0.3px',
                }}
              >
                Shanti
              </span>
              <span
                className="nav-desktop"
                style={{
                  fontSize: '11px',
                  color: '#9E8E82',
                  marginLeft: '6px',
                }}
              >
                Centro de Yoga
              </span>
            </div>
          </div>

          {/* Botones desktop */}
          <div
            className="home-nav-desktop"
            style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <Link
              href="/login"
              style={{
                fontSize: '14px',
                color: '#6B5B4E',
                padding: '8px 16px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
              }}
            >
              Iniciar sesión
            </Link>
            <Link
              href="/register"
              style={{
                fontSize: '14px',
                fontWeight: '600',
                color: 'white',
                backgroundColor: '#7C6BC4',
                padding: '10px 20px',
                borderRadius: '10px',
                textDecoration: 'none',
                boxShadow: '0 2px 8px rgba(124,107,196,0.35)',
              }}
            >
              Empezar gratis
            </Link>
          </div>

          {/* Botones móvil */}
          <div
            className="home-nav-mobile"
            style={{ alignItems: 'center', gap: '6px', flexShrink: 0 }}
          >
            <Link
              href="/login"
              style={{
                fontSize: '12px',
                color: '#6B5B4E',
                padding: '7px 10px',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: '500',
                border: '1px solid #EDE8E0',
                whiteSpace: 'nowrap',
              }}
            >
              Entrar
            </Link>
            <Link
              href="/register"
              style={{
                fontSize: '12px',
                fontWeight: '600',
                color: 'white',
                backgroundColor: '#7C6BC4',
                padding: '7px 12px',
                borderRadius: '8px',
                textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}
            >
              Registro
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section
        className="grid-hero"
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '80px 24px 60px',
        }}
      >
        <div>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '6px',
              backgroundColor: '#EDE9F8',
              borderRadius: '20px',
              padding: '6px 14px',
              marginBottom: '24px',
            }}
          >
            <span style={{ fontSize: '12px' }}>✨</span>
            <span
              style={{ fontSize: '12px', fontWeight: '500', color: '#7C6BC4' }}
            >
              Más de 500 alumnos nos eligen
            </span>
          </div>

          <h1
            style={{
              fontSize: '52px',
              fontWeight: '700',
              color: '#3D3530',
              lineHeight: '1.1',
              letterSpacing: '-1.5px',
              marginBottom: '20px',
            }}
          >
            Tu centro de yoga,
            <br />
            <span style={{ color: '#7C6BC4' }}>siempre contigo</span>
          </h1>

          <p
            style={{
              fontSize: '18px',
              color: '#6B5B4E',
              lineHeight: '1.7',
              marginBottom: '36px',
              maxWidth: '440px',
            }}
          >
            Reserva clases, gestiona tu membresía y conecta con instructores
            certificados. Todo desde un solo lugar.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '12px',
              flexWrap: 'wrap',
              marginBottom: '40px',
            }}
          >
            <Link
              href="/register"
              style={{
                fontSize: '15px',
                fontWeight: '600',
                color: 'white',
                backgroundColor: '#7C6BC4',
                padding: '14px 28px',
                borderRadius: '12px',
                textDecoration: 'none',
                boxShadow: '0 4px 16px rgba(124,107,196,0.4)',
                display: 'inline-block',
              }}
            >
              Crear cuenta gratuita
            </Link>
            <Link
              href="/login"
              style={{
                fontSize: '15px',
                fontWeight: '500',
                color: '#3D3530',
                backgroundColor: 'white',
                padding: '14px 28px',
                borderRadius: '12px',
                textDecoration: 'none',
                border: '1px solid #EDE8E0',
                display: 'inline-block',
              }}
            >
              Ver clases →
            </Link>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex' }}>
              {['🧘', '🧘‍♂️', '🧘‍♀️', '🙏'].map((emoji, i) => (
                <div
                  key={i}
                  style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#EDE9F8',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    marginLeft: i === 0 ? '0' : '-8px',
                    border: '2px solid #FDFAF5',
                  }}
                >
                  {emoji}
                </div>
              ))}
            </div>
            <p style={{ fontSize: '13px', color: '#9E8E82' }}>
              <strong style={{ color: '#3D3530' }}>500+</strong> personas ya
              practican con nosotros
            </p>
          </div>
        </div>

        {/* Hero visual */}
        <div className="hero-visual" style={{ position: 'relative' }}>
          <div
            style={{
              backgroundColor: '#EDE9F8',
              borderRadius: '24px',
              padding: '32px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Decoración */}
            <div
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                width: '120px',
                height: '120px',
                backgroundColor: '#8FAF8F',
                borderRadius: '50%',
                opacity: '0.2',
              }}
            ></div>
            <div
              style={{
                position: 'absolute',
                bottom: '-30px',
                left: '-10px',
                width: '80px',
                height: '80px',
                backgroundColor: '#C4A882',
                borderRadius: '50%',
                opacity: '0.2',
              }}
            ></div>

            {/* Card próxima clase */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '20px',
                marginBottom: '16px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '12px',
                }}
              >
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: '500',
                    color: '#7C6BC4',
                    backgroundColor: '#EDE9F8',
                    padding: '4px 10px',
                    borderRadius: '20px',
                  }}
                >
                  · Hoy ·
                </span>
                <span style={{ fontSize: '12px', color: '#9E8E82' }}>
                  3 plazas
                </span>
              </div>
              <p
                style={{
                  fontSize: '16px',
                  fontWeight: '600',
                  color: '#3D3530',
                  marginBottom: '4px',
                }}
              >
                Hatha Yoga Mañana
              </p>
              <p style={{ fontSize: '13px', color: '#9E8E82' }}>
                con Ana García · 60 min
              </p>
              <div
                style={{
                  marginTop: '14px',
                  backgroundColor: '#7C6BC4',
                  borderRadius: '8px',
                  padding: '10px',
                  textAlign: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: 'white',
                  }}
                >
                  Reservar plaza
                </span>
              </div>
            </div>

            {/* Card membresía */}
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '20px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <p
                    style={{
                      fontSize: '12px',
                      color: '#9E8E82',
                      marginBottom: '2px',
                    }}
                  >
                    Tu membresía
                  </p>
                  <p
                    style={{
                      fontSize: '15px',
                      fontWeight: '600',
                      color: '#3D3530',
                    }}
                  >
                    Plan Premium
                  </p>
                </div>
                <div
                  style={{
                    width: '40px',
                    height: '40px',
                    backgroundColor: '#EAF2EA',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '18px',
                  }}
                >
                  ✅
                </div>
              </div>
              <div
                style={{
                  marginTop: '12px',
                  height: '6px',
                  backgroundColor: '#F5F0E8',
                  borderRadius: '3px',
                  overflow: 'hidden',
                }}
              >
                <div
                  style={{
                    height: '100%',
                    width: '65%',
                    backgroundColor: '#7C6BC4',
                    borderRadius: '3px',
                  }}
                ></div>
              </div>
              <p
                style={{ fontSize: '11px', color: '#9E8E82', marginTop: '6px' }}
              >
                13 clases este mes · Activa hasta dic 2026
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* LOGOS / SOCIAL PROOF */}
      <section
        style={{
          backgroundColor: '#F5F0E8',
          padding: '24px 0',
          borderTop: '1px solid #EDE8E0',
          borderBottom: '1px solid #EDE8E0',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '48px',
            flexWrap: 'wrap',
          }}
        >
          {[
            { num: '500+', label: 'Alumnos activos' },
            { num: '20+', label: 'Clases semanales' },
            { num: '8', label: 'Instructores' },
            { num: '5★', label: 'Valoración media' },
            { num: '3', label: 'Disciplinas' },
          ].map((stat) => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <p
                style={{
                  fontSize: '22px',
                  fontWeight: '700',
                  color: '#7C6BC4',
                  lineHeight: '1',
                }}
              >
                {stat.num}
              </p>
              <p
                style={{ fontSize: '12px', color: '#9E8E82', marginTop: '4px' }}
              >
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* DISCIPLINAS */}
      <section
        style={{ maxWidth: '1100px', margin: '0 auto', padding: '96px 24px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2
            style={{
              fontSize: '38px',
              fontWeight: '700',
              color: '#3D3530',
              letterSpacing: '-1px',
              marginBottom: '12px',
            }}
          >
            Encuentra tu práctica
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#9E8E82',
              maxWidth: '480px',
              margin: '0 auto',
            }}
          >
            Ofrecemos diferentes disciplinas adaptadas a todos los niveles
          </p>
        </div>

        <div className="grid-3" style={{ gap: '24px' }}>
          {[
            {
              emoji: '🧘',
              name: 'Hatha Yoga',
              desc: 'La práctica más tradicional. Ideal para todos los niveles, equilibra cuerpo y mente a través de posturas clásicas.',
              color: '#EDE9F8',
              accent: '#7C6BC4',
              tag: 'Para todos los niveles',
            },
            {
              emoji: '🌊',
              name: 'Vinyasa Flow',
              desc: 'Secuencias dinámicas y fluidas que conectan respiración y movimiento en una práctica energizante.',
              color: '#EAF2EA',
              accent: '#769F76',
              tag: 'Nivel medio',
            },
            {
              emoji: '🌙',
              name: 'Yin Yoga',
              desc: 'Posturas largas y restaurativas que liberan tensión profunda. Perfecta para el final del día.',
              color: '#F5EDE0',
              accent: '#C4A882',
              tag: 'Relajación profunda',
            },
          ].map((clase) => (
            <div
              key={clase.name}
              style={{
                backgroundColor: clase.color,
                borderRadius: '20px',
                padding: '32px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  display: 'inline-block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: clase.accent,
                  backgroundColor: 'white',
                  padding: '4px 12px',
                  borderRadius: '20px',
                  marginBottom: '20px',
                }}
              >
                {clase.tag}
              </div>
              <div style={{ fontSize: '40px', marginBottom: '16px' }}>
                {clase.emoji}
              </div>
              <h3
                style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#3D3530',
                  marginBottom: '10px',
                }}
              >
                {clase.name}
              </h3>
              <p
                style={{
                  fontSize: '14px',
                  color: '#6B5B4E',
                  lineHeight: '1.6',
                }}
              >
                {clase.desc}
              </p>
              <Link
                href="/register"
                style={{
                  display: 'inline-block',
                  marginTop: '20px',
                  fontSize: '13px',
                  fontWeight: '600',
                  color: clase.accent,
                  textDecoration: 'none',
                }}
              >
                Ver clases →
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section style={{ backgroundColor: '#F5F0E8', padding: '96px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2
              style={{
                fontSize: '38px',
                fontWeight: '700',
                color: '#3D3530',
                letterSpacing: '-1px',
                marginBottom: '12px',
              }}
            >
              Así de fácil
            </h2>
            <p style={{ fontSize: '16px', color: '#9E8E82' }}>
              En tres pasos empiezas tu práctica
            </p>
          </div>

          <div className="grid-3" style={{ gap: '32px' }}>
            {[
              {
                step: '01',
                title: 'Crea tu cuenta',
                desc: 'Regístrate gratis en menos de un minuto. Sin compromisos.',
                icon: '👤',
              },
              {
                step: '02',
                title: 'Elige tu plan',
                desc: 'Selecciona la membresía perfecta para tu ritmo de vida.',
                icon: '✨',
              },
              {
                step: '03',
                title: 'Reserva y practica',
                desc: 'Explora el calendario, reserva tu clase favorita y disfruta.',
                icon: '🧘',
              },
            ].map((item, i) => (
              <div
                key={item.step}
                style={{ textAlign: 'center', position: 'relative' }}
              >
                {i < 2 && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '28px',
                      right: '-16px',
                      width: '32px',
                      height: '2px',
                      backgroundColor: '#EDE8E0',
                      zIndex: 1,
                    }}
                  ></div>
                )}
                <div
                  style={{
                    width: '56px',
                    height: '56px',
                    backgroundColor: '#7C6BC4',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 20px',
                    fontSize: '22px',
                  }}
                >
                  {item.icon}
                </div>
                <p
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: '#9E8E82',
                    letterSpacing: '1px',
                    marginBottom: '8px',
                  }}
                >
                  PASO {item.step}
                </p>
                <h3
                  style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#3D3530',
                    marginBottom: '8px',
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: '14px',
                    color: '#9E8E82',
                    lineHeight: '1.6',
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* TESTIMONIOS */}
      <section
        style={{ maxWidth: '1100px', margin: '0 auto', padding: '96px 24px' }}
      >
        <div style={{ textAlign: 'center', marginBottom: '56px' }}>
          <h2
            style={{
              fontSize: '38px',
              fontWeight: '700',
              color: '#3D3530',
              letterSpacing: '-1px',
              marginBottom: '12px',
            }}
          >
            Lo que dicen nuestros alumnos
          </h2>
        </div>
        <div className="grid-3" style={{ gap: '24px' }}>
          {[
            {
              name: 'María G.',
              role: 'Alumna Premium',
              text: 'Desde que empecé con Shanti me siento más tranquila y centrada. El sistema de reservas es super fácil de usar.',
              avatar: 'M',
            },
            {
              name: 'Carlos R.',
              role: 'Alumno Básico',
              text: 'Las clases de Vinyasa con Carlos son increíbles. Reservar es muy cómodo y los instructores son fantásticos.',
              avatar: 'C',
            },
            {
              name: 'Laura P.',
              role: 'Alumna Anual',
              text: 'El mejor centro de yoga que he probado. La app es muy intuitiva y siempre encuentro hueco en las clases que quiero.',
              avatar: 'L',
            },
          ].map((t) => (
            <div
              key={t.name}
              style={{
                backgroundColor: 'white',
                borderRadius: '20px',
                padding: '28px',
                border: '1px solid #EDE8E0',
                boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
              }}
            >
              <div style={{ display: 'flex', marginBottom: '8px' }}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} style={{ color: '#C4A882', fontSize: '14px' }}>
                    ★
                  </span>
                ))}
              </div>
              <p
                style={{
                  fontSize: '14px',
                  color: '#6B5B4E',
                  lineHeight: '1.7',
                  marginBottom: '20px',
                }}
              >
                "{t.text}"
              </p>
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '10px' }}
              >
                <div
                  style={{
                    width: '36px',
                    height: '36px',
                    backgroundColor: '#EDE9F8',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#7C6BC4',
                  }}
                >
                  {t.avatar}
                </div>
                <div>
                  <p
                    style={{
                      fontSize: '13px',
                      fontWeight: '600',
                      color: '#3D3530',
                    }}
                  >
                    {t.name}
                  </p>
                  <p style={{ fontSize: '11px', color: '#9E8E82' }}>{t.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRECIOS */}
      <section style={{ backgroundColor: '#F5F0E8', padding: '96px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2
              style={{
                fontSize: '38px',
                fontWeight: '700',
                color: '#3D3530',
                letterSpacing: '-1px',
                marginBottom: '12px',
              }}
            >
              Sin sorpresas
            </h2>
            <p style={{ fontSize: '16px', color: '#9E8E82' }}>
              {' '}
              Precios claros · Sin permanencia · Cancela cuando quieras{' '}
            </p>
          </div>

          <div
            className="grid-2"
            style={{ maxWidth: '700px', margin: '0 auto' }}
          >
            {[
              {
                name: 'Básico',
                price: '49.99',
                period: 'mes',
                desc: '8 clases al mes',
                features: [
                  '8 clases mensuales',
                  'Todas las disciplinas',
                  'Reserva online',
                  'Cancelación flexible',
                ],
                highlight: false,
              },
              {
                name: 'Premium',
                price: '79.99',
                period: 'mes',
                desc: 'Clases ilimitadas',
                features: [
                  'Clases ilimitadas',
                  'Acceso prioritario',
                  'Todas las disciplinas',
                  'Reserva online',
                ],
                highlight: true,
              },
            ].map((plan) => (
              <div
                key={plan.name}
                style={{
                  backgroundColor: plan.highlight ? '#7C6BC4' : 'white',
                  borderRadius: '20px',
                  padding: '32px',
                  border: plan.highlight ? 'none' : '1px solid #EDE8E0',
                  boxShadow: plan.highlight
                    ? '0 8px 32px rgba(124,107,196,0.35)'
                    : '0 4px 20px rgba(0,0,0,0.04)',
                  position: 'relative',
                }}
              >
                {plan.highlight && (
                  <div
                    style={{
                      position: 'absolute',
                      top: '-12px',
                      left: '50%',
                      transform: 'translateX(-50%)',
                      backgroundColor: '#C4A882',
                      color: 'white',
                      fontSize: '11px',
                      fontWeight: '700',
                      padding: '4px 14px',
                      borderRadius: '20px',
                      letterSpacing: '0.5px',
                    }}
                  >
                    MÁS POPULAR
                  </div>
                )}
                <h3
                  style={{
                    fontSize: '20px',
                    fontWeight: '600',
                    color: plan.highlight ? 'white' : '#3D3530',
                    marginBottom: '6px',
                  }}
                >
                  {plan.name}
                </h3>
                <p
                  style={{
                    fontSize: '13px',
                    color: plan.highlight ? 'rgba(255,255,255,0.7)' : '#9E8E82',
                    marginBottom: '20px',
                  }}
                >
                  {plan.desc}
                </p>
                <div style={{ marginBottom: '24px' }}>
                  <span
                    style={{
                      fontSize: '40px',
                      fontWeight: '700',
                      color: plan.highlight ? 'white' : '#3D3530',
                      letterSpacing: '-1px',
                    }}
                  >
                    {plan.price}€
                  </span>
                  <span
                    style={{
                      fontSize: '14px',
                      color: plan.highlight
                        ? 'rgba(255,255,255,0.6)'
                        : '#9E8E82',
                    }}
                  >
                    /mes
                  </span>
                </div>
                <ul
                  style={{
                    marginBottom: '28px',
                    listStyle: 'none',
                    padding: 0,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                  }}
                >
                  {plan.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        fontSize: '14px',
                        color: plan.highlight
                          ? 'rgba(255,255,255,0.9)'
                          : '#6B5B4E',
                      }}
                    >
                      <span
                        style={{
                          width: '18px',
                          height: '18px',
                          backgroundColor: plan.highlight
                            ? 'rgba(255,255,255,0.2)'
                            : '#EDE9F8',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '10px',
                          flexShrink: 0,
                        }}
                      >
                        ✓
                      </span>
                      {f}
                    </li>
                  ))}
                </ul>
                <Link
                  href="/register"
                  style={{
                    display: 'block',
                    textAlign: 'center',
                    backgroundColor: plan.highlight ? 'white' : '#7C6BC4',
                    color: plan.highlight ? '#7C6BC4' : 'white',
                    borderRadius: '10px',
                    padding: '13px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textDecoration: 'none',
                  }}
                >
                  Empezar ahora
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '96px 24px',
          textAlign: 'center',
        }}
      >
        <div
          style={{
            backgroundColor: '#EDE9F8',
            borderRadius: '28px',
            padding: '64px 48px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: '-40px',
              right: '-40px',
              width: '200px',
              height: '200px',
              backgroundColor: '#7C6BC4',
              borderRadius: '50%',
              opacity: '0.1',
            }}
          ></div>
          <div
            style={{
              position: 'absolute',
              bottom: '-60px',
              left: '-20px',
              width: '150px',
              height: '150px',
              backgroundColor: '#8FAF8F',
              borderRadius: '50%',
              opacity: '0.15',
            }}
          ></div>
          <span
            style={{ fontSize: '48px', display: 'block', marginBottom: '20px' }}
          >
            🪷
          </span>
          <h2
            style={{
              fontSize: '40px',
              fontWeight: '700',
              color: '#3D3530',
              letterSpacing: '-1px',
              marginBottom: '16px',
            }}
          >
            Tu viaje comienza aquí
          </h2>
          <p
            style={{
              fontSize: '16px',
              color: '#6B5B4E',
              marginBottom: '36px',
              maxWidth: '440px',
              margin: '0 auto 36px',
            }}
          >
            Únete a cientos de personas que ya encontraron su equilibrio en
            Shanti. Primera semana gratis.
          </p>
          <Link
            href="/register"
            style={{
              display: 'inline-block',
              backgroundColor: '#7C6BC4',
              color: 'white',
              borderRadius: '12px',
              padding: '16px 40px',
              fontSize: '16px',
              fontWeight: '600',
              textDecoration: 'none',
              boxShadow: '0 8px 24px rgba(124,107,196,0.4)',
            }}
          >
            Crear cuenta gratuita
          </Link>
          <p style={{ fontSize: '12px', color: '#9E8E82', marginTop: '16px' }}>
            {' '}
            · Cancela cuando quieras ·{' '}
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer
        style={{
          borderTop: '1px solid #EDE8E0',
          backgroundColor: 'white',
          padding: '32px 24px',
        }}
      >
        <div
          style={{
            maxWidth: '1100px',
            margin: '0 auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{ fontSize: '20px' }}>🪷</span>
            <span
              style={{ fontSize: '15px', fontWeight: '600', color: '#3D3530' }}
            >
              Shanti
            </span>
            <span style={{ fontSize: '13px', color: '#9E8E82' }}>
              · Centro de Yoga & Meditación
            </span>
          </div>
          <p style={{ fontSize: '13px', color: '#9E8E82' }}>
            © 2026 Shanti · Todos los derechos reservados
          </p>
        </div>
      </footer>
    </div>
  );
}
