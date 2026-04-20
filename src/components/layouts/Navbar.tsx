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
  Menu,
  X,
  ShoppingBag,
  MessageCircle,
} from 'lucide-react';
import { useState, useEffect } from 'react';
import CartDrawer from '@/components/shop/CartDrawer';

export default function Navbar() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [menuOpen, setMenuOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const links: {
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
    badge?: number;
  }[] = [
    { href: '/dashboard', label: 'Inicio', icon: Home },
    { href: '/clases', label: 'Clases', icon: Calendar },
    { href: '/instructores', label: 'Instructores', icon: Users },
    { href: '/tienda', label: 'Tienda', icon: ShoppingBag },
    {
      href: '/mensajes',
      label: 'Mensajes',
      icon: MessageCircle,
      badge: unreadCount > 0 ? unreadCount : undefined,
    },
    { href: '/precios', label: 'Precios', icon: CreditCard },
    { href: '/perfil', label: 'Perfil', icon: User },
  ];

  const adminLinks: {
    href: string;
    label: string;
    icon: React.ComponentType<{ size?: number }>;
    badge?: number;
  }[] = [{ href: '/admin', label: 'Admin', icon: Settings }];

  const allLinks =
    (session?.user as { role?: string })?.role === 'ADMIN'
      ? [...links, ...adminLinks]
      : links;

  // Fetch unread messages count
  useEffect(() => {
    if (!session?.user) return;

    const fetchUnread = async () => {
      try {
        const res = await fetch('/api/conversations/unread');
        if (!res.ok) return;
        const data = await res.json();
        setUnreadCount(data.unreadCount);
      } catch {
        // silenciar errores
      }
    };

    fetchUnread();
    const interval = setInterval(fetchUnread, 15000);
    return () => clearInterval(interval);
  }, [session?.user]);
  return (
    <>
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
            // maxWidth: '1100px',
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

          {/* Links desktop */}
          <div
            className="nav-desktop"
            style={{ display: 'flex', alignItems: 'center', gap: '4px' }}
          >
            {allLinks.map(({ href, label, icon: Icon, badge }) => {
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
                    position: 'relative',
                  }}
                >
                  <Icon size={15} />
                  {label}
                  {badge && badge > 0 && (
                    <span
                      style={{
                        // position: 'absolute',
                        top: '4px',
                        right: '4px',
                        backgroundColor: '#DC2626',
                        color: 'white',
                        borderRadius: '50%',
                        width: '16px',
                        height: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '9px',
                        fontWeight: '700',
                      }}
                    >
                      {badge > 9 ? '9+' : badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </div>

          {/* Usuario desktop */}
          <div
            className="nav-desktop"
            style={{ display: 'flex', alignItems: 'center', gap: '12px' }}
          >
            <CartDrawer />
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
                style={{
                  fontSize: '13px',
                  color: '#6B5B4E',
                  fontWeight: '500',
                }}
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

          {/* Botón hamburguesa móvil */}
          <button
            className="nav-mobile"
            onClick={() => setMenuOpen(!menuOpen)}
            style={{
              display: 'none',
              alignItems: 'center',
              justifyContent: 'center',
              width: '40px',
              height: '40px',
              backgroundColor: '#EDE9F8',
              border: 'none',
              borderRadius: '10px',
              cursor: 'pointer',
              color: '#7C6BC4',
              position: 'relative',
            }}
          >
            {menuOpen ? <X size={20} /> : <Menu size={20} />}
            {unreadCount > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  backgroundColor: '#DC2626',
                  color: 'white',
                  borderRadius: '50%',
                  width: '14px',
                  height: '14px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '8px',
                  fontWeight: '700',
                }}
              >
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </nav>

      {/* Menú móvil */}
      {menuOpen && (
        <div
          style={{
            position: 'fixed',
            top: '64px',
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#FDFAF5',
            zIndex: 49,
            padding: '24px 20px',
            display: 'flex',
            flexDirection: 'column',
            gap: '8px',
            overflowY: 'auto',
          }}
        >
          {allLinks.map(({ href, label, icon: Icon, badge }) => {
            const isActive = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                onClick={() => setMenuOpen(false)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '14px 16px',
                  borderRadius: '12px',
                  fontSize: '15px',
                  fontWeight: isActive ? '600' : '400',
                  color: isActive ? '#7C6BC4' : '#3D3530',
                  backgroundColor: isActive ? '#EDE9F8' : 'white',
                  textDecoration: 'none',
                  border: '1px solid #EDE8E0',
                  position: 'relative',
                }}
              >
                <Icon size={18} />
                {label}
                {badge && badge > 0 && (
                  <span
                    style={{
                      marginLeft: 'auto',
                      backgroundColor: '#DC2626',
                      color: 'white',
                      borderRadius: '20px',
                      padding: '2px 8px',
                      fontSize: '11px',
                      fontWeight: '700',
                    }}
                  >
                    {badge > 9 ? '9+' : badge}
                  </span>
                )}
              </Link>
            );
          })}

          <div
            style={{
              height: '1px',
              backgroundColor: '#EDE8E0',
              margin: '8px 0',
            }}
          ></div>

          <div style={{ marginBottom: '8px' }}>
            <CartDrawer />
          </div>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '12px 16px',
              backgroundColor: 'white',
              borderRadius: '12px',
              border: '1px solid #EDE8E0',
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
                fontSize: '14px',
                fontWeight: '700',
                color: '#7C6BC4',
              }}
            >
              {session?.user?.name?.charAt(0).toUpperCase()}
            </div>
            <div>
              <p
                style={{
                  fontSize: '14px',
                  fontWeight: '600',
                  color: '#3D3530',
                  margin: 0,
                }}
              >
                {session?.user?.name}
              </p>
              <p style={{ fontSize: '12px', color: '#9E8E82', margin: 0 }}>
                {session?.user?.email}
              </p>
            </div>
          </div>

          <button
            onClick={() => signOut({ callbackUrl: '/login' })}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              padding: '14px 16px',
              borderRadius: '12px',
              fontSize: '15px',
              color: '#DC2626',
              backgroundColor: '#FEF2F2',
              border: 'none',
              cursor: 'pointer',
              fontWeight: '500',
            }}
          >
            <LogOut size={18} />
            Cerrar sesión
          </button>
        </div>
      )}

      <style>{`
        @media (max-width: 768px) {
          .nav-desktop { display: none !important; }
          .nav-mobile { display: flex !important; }
        }
        @media (min-width: 769px) {
          .nav-mobile { display: none !important; }
          .nav-desktop { display: flex !important; }
        }
      `}</style>
    </>
  );
}
