import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import ClassCalendar from '@/components/booking/ClassCalendar';

export default async function ClasesPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            📅 Clases de Yoga
          </h1>
          <p className="mt-1 text-gray-500">Reserva tu clase favorita</p>
        </div>
        <ClassCalendar />
      </div>
    </div>
  );
}
