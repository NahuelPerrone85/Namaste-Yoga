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
    <div>
      <div style={{ textAlign: 'center', marginBottom: '32px' }}>
        <span style={{ fontSize: '32px' }}>🪷</span>
        <h1
          style={{
            fontSize: '24px',
            fontWeight: '700',
            color: '#3D3530',
            marginTop: '8px',
            letterSpacing: '-0.5px',
          }}
        >
          Crear cuenta
        </h1>
        <p style={{ fontSize: '14px', color: '#9E8E82', marginTop: '6px' }}>
          Únete a Shanti y empieza tu práctica hoy
        </p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#6B5B4E',
              marginBottom: '6px',
            }}
          >
            Nombre completo
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #EDE8E0',
              backgroundColor: 'white',
              fontSize: '14px',
              color: '#3D3530',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            placeholder="Tu nombre"
            required
          />
        </div>

        <div style={{ marginBottom: '16px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#6B5B4E',
              marginBottom: '6px',
            }}
          >
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #EDE8E0',
              backgroundColor: 'white',
              fontSize: '14px',
              color: '#3D3530',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            placeholder="tu@email.com"
            required
          />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <label
            style={{
              display: 'block',
              fontSize: '13px',
              fontWeight: '500',
              color: '#6B5B4E',
              marginBottom: '6px',
            }}
          >
            Contraseña
          </label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px 16px',
              borderRadius: '10px',
              border: '1px solid #EDE8E0',
              backgroundColor: 'white',
              fontSize: '14px',
              color: '#3D3530',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            placeholder="Mínimo 6 caracteres"
            required
            minLength={6}
          />
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              border: '1px solid #FECACA',
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '16px',
            }}
          >
            <p style={{ fontSize: '13px', color: '#DC2626' }}>{error}</p>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          style={{
            width: '100%',
            padding: '13px',
            backgroundColor: loading ? '#A598D4' : '#7C6BC4',
            color: 'white',
            borderRadius: '10px',
            border: 'none',
            fontSize: '15px',
            fontWeight: '600',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 16px rgba(124,107,196,0.35)',
            transition: 'opacity 0.2s',
          }}
        >
          {loading ? 'Creando cuenta...' : 'Crear cuenta gratis'}
        </button>
      </form>

      <div
        style={{
          backgroundColor: '#F5F0E8',
          borderRadius: '10px',
          padding: '12px 16px',
          marginTop: '16px',
        }}
      >
        <p style={{ fontSize: '12px', color: '#9E8E82', textAlign: 'center' }}>
          ✓ Sin tarjeta de crédito · ✓ Cancela cuando quieras
        </p>
      </div>

      <p
        style={{
          textAlign: 'center',
          fontSize: '13px',
          color: '#9E8E82',
          marginTop: '20px',
        }}
      >
        ¿Ya tienes cuenta?{' '}
        <Link
          href="/login"
          style={{
            color: '#7C6BC4',
            fontWeight: '600',
            textDecoration: 'none',
          }}
        >
          Iniciar sesión
        </Link>
      </p>
    </div>
  );
}
