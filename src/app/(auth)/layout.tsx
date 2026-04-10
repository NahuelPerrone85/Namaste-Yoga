export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid-auth">
      {/* Panel izquierdo — visual */}
      <div
        className="auth-left-panel"
        style={{
          backgroundColor: '#EDE9F8',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decoración */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '240px',
            height: '240px',
            backgroundColor: '#7C6BC4',
            borderRadius: '50%',
            opacity: '0.1',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            bottom: '-80px',
            left: '-40px',
            width: '200px',
            height: '200px',
            backgroundColor: '#8FAF8F',
            borderRadius: '50%',
            opacity: '0.15',
          }}
        ></div>
        <div
          style={{
            position: 'absolute',
            top: '40%',
            left: '-20px',
            width: '100px',
            height: '100px',
            backgroundColor: '#C4A882',
            borderRadius: '50%',
            opacity: '0.1',
          }}
        ></div>

        <div
          style={{
            position: 'relative',
            zIndex: 1,
            textAlign: 'center',
            maxWidth: '400px',
          }}
        >
          <div style={{ fontSize: '64px', marginBottom: '12px' }}>🪷</div>

          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#3D3530',
              letterSpacing: '-1px',
              marginBottom: '16px',
              lineHeight: '1.2',
            }}
          >
            Shanti
          </h1>
          <p
            style={{
              fontSize: '16px',
              color: '#6B5B4E',
              lineHeight: '1.7',
              marginBottom: '40px',
            }}
          >
            Yoga & Meditación
            {/* Encuentra tu paz interior a través de una práctica consciente. */}
          </p>

          {/* Testimonial */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '24px',
              boxShadow: '0 4px 20px rgba(0,0,0,0.06)',
              textAlign: 'left',
            }}
          >
            <div style={{ display: 'flex', marginBottom: '10px' }}>
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
                lineHeight: '1.6',
                marginBottom: '16px',
              }}
            >
              "Shanti cambió mi vida. Las clases son increíbles y el sistema de
              reservas es muy fácil de usar."
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
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
                M
              </div>
              <div>
                <p
                  style={{
                    fontSize: '13px',
                    fontWeight: '600',
                    color: '#3D3530',
                  }}
                >
                  María García
                </p>
                <p style={{ fontSize: '11px', color: '#9E8E82' }}>
                  Alumna Premium · 2 años
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Panel derecho — formulario */}
      <div
        style={{
          backgroundColor: '#FDFAF5',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '48px',
        }}
      >
        <div style={{ width: '100%', maxWidth: '400px' }}>{children}</div>
      </div>
    </div>
  );
}
