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
import { Button } from '@/components/ui/button';

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
    <nav className="sticky top-0 z-50 border-b border-gray-200 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/dashboard" className="flex items-center gap-2">
            <span className="text-2xl">🧘</span>
            <span className="text-lg font-bold text-gray-900">
              Namaste Yoga
            </span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-1">
            {allLinks.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition ${
                  pathname === href
                    ? 'bg-purple-100 text-purple-700'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-4 w-4" />
                {label}
              </Link>
            ))}
          </div>

          {/* Usuario */}
          <div className="flex items-center gap-3">
            <span className="text-sm text-gray-500">{session?.user?.name}</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => signOut({ callbackUrl: '/login' })}
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              Salir
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
}
