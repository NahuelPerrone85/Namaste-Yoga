# 🧘 Namaste Yoga — Roadmap de Desarrollo

## Stack Tecnológico

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes
- **Base de datos**: PostgreSQL (Supabase) + Prisma ORM
- **Autenticación**: Auth.js v5
- **Pagos**: Stripe
- **Deploy**: Vercel
- **Testing**: Vitest + Testing Library

---

## ✅ FASE 0 — Setup & Configuración

- [x] Crear proyecto Next.js 15 con TypeScript + Tailwind
- [x] Instalar dependencias: Prisma v5, Auth.js, Zod, date-fns
- [x] Configurar Prettier + Husky + lint-staged
- [x] Crear proyecto en Supabase (PostgreSQL en la nube)
- [x] Conectar Prisma con Supabase
- [x] Configurar variables de entorno (.env + .env.example)
- [x] Subir proyecto a GitHub
- [x] Deploy inicial en Vercel

---

## ✅ FASE 1 — Base de Datos & Modelos

- [x] Modelo `User` — alumnos, instructores y admins
- [x] Modelo `Instructor` — perfil del instructor
- [x] Modelo `ClassType` — tipos de clase (Hatha, Vinyasa, Yin...)
- [x] Modelo `Class` — clase concreta con fecha, hora y plazas
- [x] Modelo `Booking` — reserva de un alumno a una clase
- [x] Modelo `Membership` — tipos de membresía
- [x] Modelo `UserMembership` — membresía activa de un usuario
- [x] Modelo `Payment` — registro de pagos
- [x] Ejecutar primera migración
- [x] Crear archivo `prisma/seed.ts` con datos de prueba
- [x] Poblar la BD: 2 instructores, 5 clases, 4 membresías
- [x] Crear `src/lib/db.ts` — cliente Prisma singleton

---

## ✅ FASE 2 — Autenticación & Autorización

- [x] Configurar Auth.js v5 con email/contraseña
- [x] Registro de usuarios con contraseña hasheada (bcrypt)
- [x] Login seguro con JWT
- [x] Middleware de protección de rutas
- [x] Roles: ADMIN, INSTRUCTOR, MEMBER
- [x] Página de login
- [x] Página de registro
- [x] Dashboard protegido

---

## ✅ FASE 3 — Core: Reservas de Clases

- [x] Calendario semanal de clases con navegación
- [x] Card de clase: nombre, instructor, hora, plazas disponibles
- [x] Indicador de plazas: disponible / pocas plazas / lleno
- [x] API: crear reserva con validaciones
- [x] API: cancelar reserva con política de 2h
- [x] Re-reservar clase cancelada
- [x] Dashboard con próximas reservas
- [x] Notificación visual al reservar/cancelar

---

## ✅ FASE 4 — Pagos & Membresías (Stripe)

- [x] 4 planes de membresía: Básico, Premium, Trimestral, Anual
- [x] Página de precios con cards
- [x] Checkout con Stripe
- [x] Webhook activa membresía automáticamente
- [x] Dashboard muestra membresía activa

---

## ✅ FASE 5 — Panel de Administración

- [x] Dashboard admin con stats: alumnos, reservas, ingresos
- [x] Clases del día con ocupación
- [x] Últimas reservas en tiempo real
- [x] Acceso protegido solo para rol ADMIN
- [x] Link en navbar solo visible para admins

---

## ✅ PERFIL DE USUARIO

- [x] Página de perfil con foto, nombre y bio
- [x] Editar nombre, bio y foto de perfil
- [x] Estadísticas: total clases y clases asistidas
- [x] Historial de clases pasadas
- [x] Membresía activa con fecha de expiración

---

## ✅ SEGURIDAD

- [x] Security headers en next.config.ts
- [x] HTTPS forzado (HSTS)
- [x] Protección contra clickjacking (X-Frame-Options)
- [x] Protección XSS (X-Content-Type-Options)
- [x] Middleware de autenticación en rutas protegidas
- [x] Validación de inputs con Zod
- [x] Contraseñas hasheadas con bcrypt

---

## ✅ TESTING

- [x] Configurar Vitest + Testing Library
- [x] Tests unitarios: lógica de cancelación
- [x] Tests unitarios: plazas disponibles
- [x] Tests de componentes: ClassCard
- [x] 12 tests pasando

---

## 📋 Convención de Commits

```
feat:     nueva funcionalidad
fix:      corrección de bug
chore:    configuración, dependencias
docs:     documentación
style:    formato, sin cambio de lógica
refactor: refactorización de código
test:     añadir o modificar tests
```

## 🌿 Estrategia de Ramas

```
main          → producción
develop       → integración
feature/xxx   → nueva funcionalidad
fix/xxx       → corrección de bug
docs/xxx      → documentación
```

## 📁 Estructura de Carpetas

```
namaste-yoga/
├── .github/workflows/     → CI/CD
├── prisma/
│   ├── schema.prisma      → modelos de BD
│   ├── migrations/        → historial de cambios
│   └── seed.ts            → datos de prueba
├── scripts/
│   └── setup-stripe.ts    → configurar productos Stripe
├── src/
│   ├── app/
│   │   ├── (auth)/        → login, register
│   │   ├── (dashboard)/   → dashboard, clases, precios, perfil
│   │   ├── (admin)/       → panel administrador
│   │   └── api/           → endpoints API
│   ├── components/
│   │   ├── booking/       → calendario, cards, precios
│   │   ├── layouts/       → navbar, session provider
│   │   ├── profile/       → formulario de perfil
│   │   └── ui/            → shadcn/ui base
│   ├── lib/
│   │   ├── auth.ts        → configuración Auth.js
│   │   ├── db.ts          → cliente Prisma
│   │   └── stripe.ts      → cliente Stripe
│   ├── tests/
│   │   └── unit/          → tests unitarios Vitest
│   └── types/             → tipos TypeScript
├── .env                   → variables locales (no subir)
├── .env.example           → plantilla
├── ROADMAP.md             → esta guía
└── vitest.config.ts       → configuración tests
```
