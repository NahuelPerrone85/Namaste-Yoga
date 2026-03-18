'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Error al registrarse');
        setLoading(false);
        return;
      }

      router.push('/login?registered=true');
    } catch {
      setError('Error al conectar con el servidor');
      setLoading(false);
    }
  };

  return (
    <div className="rounded-2xl bg-white p-8 shadow-xl">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-gray-900">🧘 Namaste Yoga</h1>
        <p className="mt-2 text-gray-500">Crea tu cuenta</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Nombre completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder="Tu nombre"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder="tu@email.com"
            required
          />
        </div>

        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-lg border border-gray-300 px-4 py-3 focus:ring-2 focus:ring-purple-500 focus:outline-none"
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
          />
        </div>

        {error && (
          <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-purple-600 py-3 font-medium text-white transition hover:bg-purple-700 disabled:cursor-not-allowed disabled:opacity-50"
        >
          {loading ? 'Creando cuenta...' : 'Crear cuenta'}
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-gray-500">
        ¿Ya tienes cuenta?{' '}
        <Link
          href="/login"
          className="font-medium text-purple-600 hover:underline"
        >
          Inicia sesión
        </Link>
      </p>
    </div>
  );
}
