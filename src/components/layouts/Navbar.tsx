'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  Calendar,
  CreditCard,
  Home,
  LogOut,
  Settings,
  User,
  Users,
} from 'lucide-react';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  const links = [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/clases', label: 'Clases', icon: Calendar },
    { href: '/instructores', label: 'Instructores', icon: Users },
    { href: '/precios', label: 'Precios', icon: CreditCard },
    { href: '/perfil', label: 'Perfil', icon: User },
  ];

  const adminLinks = [{ href: '/admin', label: 'Admin', icon: Settings }];

  const allLinks =
    (session?.user as { role?: string })?.role === 'ADMIN'
      ? [...links, ...adminLinks]
      : links;

  return (
    <nav
      style={{
        backgroundColor: 'rgba(253,250,245,0.95)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid #EDE8E0',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}
    >
      <div
        style={{
          maxWidth: '1100px',
          margin: '0 auto',
          padding: '0 24px',
          height: '64px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          href="/dashboard"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            textDecoration: 'none',
          }}
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
              fontSize: '18px',
            }}
          >
            🪷
          </div>
          <div>
            <p
              style={{
                fontSize: '16px',
                fontWeight: '600',
                color: '#3D3530',
                lineHeight: '1.2',
                margin: 0,
              }}
            >
              Shanti
            </p>
            <p style={{ fontSize: '10px', color: '#9E8E82', margin: 0 }}>
              Centro de Yoga
            </p>
          </div>
        </Link>

        {/* Links */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          {allLinks.map(({ href, label, icon: Icon }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  padding: '8px 14px',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? '#7C6BC4' : '#6B5B4E',
                  backgroundColor: isActive ? '#EDE9F8' : 'transparent',
                  textDecoration: 'none',
                  transition: 'all 0.15s',
                }}
              >
                <Icon size={15} />
                {label}
              </Link>
            );
          })}
        </div>

        {/* Usuario */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div
              style={{
                width: '32px',
                height: '32px',
                backgroundColor: '#EDE9F8',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '13px',
                fontWeight: '600',
                color: '#7C6BC4',
              }}
            >
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
            <span
              style={{ fontSize: '13px', color: '#6B5B4E', fontWeight: '500' }}
            >
              {session?.user?.name?.split(' ')[0]}
            </span>
          </div>
          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '8px 14px',
              borderRadius: '10px',
              fontSize: '13px',
              color: '#9E8E82',
              backgroundColor: 'transparent',
              border: '1px solid #EDE8E0',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            <LogOut size={14} />
            Salir
          </button>
        </div>
      </div>
    </nav>
  );
}
