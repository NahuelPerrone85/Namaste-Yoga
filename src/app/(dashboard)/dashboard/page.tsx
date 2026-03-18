import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';

export default async function DashboardPage() {
  const session = await auth();

  if (!session) {
    redirect('/login');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="mx-auto max-w-4xl">
        <h1 className="mb-2 text-3xl font-bold text-gray-900">
          🧘 Bienvenido, {session.user?.name}!
        </h1>
        <p className="mb-8 text-gray-500">Panel de control de Namaste Yoga</p>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold text-gray-700">
              Mis reservas
            </h2>
            <p className="text-3xl font-bold text-purple-600">0</p>
            <p className="mt-1 text-sm text-gray-400">clases reservadas</p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold text-gray-700">
              Membresía
            </h2>
            <p className="text-3xl font-bold text-purple-600">—</p>
            <p className="mt-1 text-sm text-gray-400">sin membresía activa</p>
          </div>

          <div className="rounded-xl border border-gray-100 bg-white p-6 shadow-sm">
            <h2 className="mb-1 text-lg font-semibold text-gray-700">
              Próxima clase
            </h2>
            <p className="text-3xl font-bold text-purple-600">—</p>
            <p className="mt-1 text-sm text-gray-400">sin clases próximas</p>
          </div>
        </div>
      </div>
    </div>
  );
}
