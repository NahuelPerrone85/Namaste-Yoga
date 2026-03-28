import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ClassCalendar from '@/components/booking/ClassCalendar';

export default async function ClasesPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FDFAF5',
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ marginBottom: '32px' }}>
          <h1
            style={{
              fontSize: '32px',
              fontWeight: '700',
              color: '#3D3530',
              letterSpacing: '-0.5px',
              marginBottom: '8px',
            }}
          >
            Calendario de clases 📅
          </h1>
          <p style={{ fontSize: '15px', color: '#9E8E82' }}>
            Reserva tu próxima práctica
          </p>
        </div>
        <ClassCalendar />
      </div>
    </div>
  );
}
