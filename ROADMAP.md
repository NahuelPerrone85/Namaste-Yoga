# 🧘 Namaste Yoga — Roadmap de Desarrollo

## Stack Tecnológico

- **Frontend**: Next.js 15 + TypeScript + Tailwind CSS + shadcn/ui
- **Backend**: Next.js API Routes + tRPC
- **Base de datos**: PostgreSQL (Supabase) + Prisma ORM
- **Auth**: Auth.js v5 (Google OAuth + Email)
- **Pagos**: Stripe
- **Deploy**: Vercel
- **Emails**: Resend
- **Cache**: Upstash Redis

---

## ✅ FASE 0 — Setup & Configuración

> Objetivo: Proyecto base listo, conectado y desplegado

- [x] Crear proyecto Next.js 15 con TypeScript + Tailwind
- [x] Instalar dependencias: Prisma v5, Auth.js, Zod, date-fns
- [x] Configurar Prettier + Husky + lint-staged
- [x] Crear proyecto en Supabase (PostgreSQL en la nube)
- [x] Conectar Prisma con Supabase
- [x] Configurar variables de entorno (.env + .env.example)
- [x] Subir proyecto a GitHub
- [x] Deploy inicial en Vercel

---

## 🗄️ FASE 1 — Base de Datos & Modelos

> Objetivo: Schema completo de la BD con todas las relaciones

### 1.1 Diseñar el schema de Prisma

- [x] Modelo `User` — alumnos, instructores y admins
- [x] Modelo `Studio` — el gimnasio/estudio de yoga
- [x] Modelo `Instructor` — perfil del instructor
- [x] Modelo `ClassType` — tipos de clase (Hatha, Vinyasa, Yin...)
- [x] Modelo `Class` — clase concreta con fecha, hora y plazas
- [x] Modelo `Booking` — reserva de un alumno a una clase
- [x] Modelo `Membership` — tipos de membresía (mensual, trimestral...)
- [x] Modelo `UserMembership` — membresía activa de un usuario
- [x] Modelo `Payment` — registro de pagos

### 1.2 Migraciones y datos de prueba

- [x] Ejecutar primera migración (`prisma migrate dev`)
- [x] Crear archivo `prisma/seed.ts` con datos de prueba
- [x] Poblar la BD: 3 instructores, 10 clases, 5 usuarios

### 1.3 Cliente Prisma

- [x] Crear `src/lib/db.ts` — cliente Prisma singleton
- [x] Verificar conexión desde Next.js

---

## 🔐 FASE 2 — Autenticación & Autorización

> Objetivo: Login seguro con roles de usuario

### 2.1 Auth.js v5

- [ ] Configurar `src/lib/auth.ts`
- [ ] Provider Google OAuth
- [ ] Provider Email (magic link)
- [ ] Guardar sesión en base de datos

### 2.2 Google OAuth

- [ ] Crear proyecto en Google Cloud Console
- [ ] Obtener CLIENT_ID y CLIENT_SECRET
- [ ] Configurar redirect URIs

### 2.3 Roles y permisos (RBAC)

- [ ] Roles: `ADMIN`, `INSTRUCTOR`, `MEMBER`
- [ ] Middleware de protección de rutas
- [ ] Rutas protegidas: `/dashboard`, `/admin`
- [ ] Rutas públicas: `/`, `/login`, `/precios`

### 2.4 Páginas de Auth

- [ ] Página de login (`/login`)
- [ ] Página de registro (`/register`)
- [ ] Página de perfil (`/dashboard/perfil`)

---

## 📅 FASE 3 — Core: Reservas de Clases

> Objetivo: Un alumno puede ver, reservar y cancelar clases

### 3.1 Calendario de clases

- [ ] Vista semanal de clases (tipo AimHarder)
- [ ] Filtros: por tipo de clase, instructor, horario
- [ ] Card de clase: nombre, instructor, hora, plazas disponibles
- [ ] Indicador de plazas: disponible / pocas plazas / lleno

### 3.2 Sistema de reservas

- [ ] API: `POST /api/bookings` — crear reserva
- [ ] API: `DELETE /api/bookings/:id` — cancelar reserva
- [ ] API: `GET /api/bookings` — mis reservas
- [ ] Validación: no doble reserva
- [ ] Validación: no reservar clase pasada
- [ ] Lista de espera cuando la clase está llena

### 3.3 Tiempo real con Supabase

- [ ] Plazas disponibles actualizadas en tiempo real
- [ ] Sin necesidad de recargar la página

### 3.4 Mis reservas

- [ ] Página `/dashboard/reservas`
- [ ] Próximas clases
- [ ] Historial de clases pasadas
- [ ] Botón cancelar con política (hasta 2h antes)

### 3.5 Notificaciones por email

- [ ] Configurar Resend
- [ ] Email de confirmación al reservar
- [ ] Email de recordatorio 1h antes de la clase
- [ ] Email de cancelación

---

## 💳 FASE 4 — Pagos & Membresías (Stripe)

> Objetivo: Sistema de membresías con pago recurrente

### 4.1 Configurar Stripe

- [ ] Crear cuenta en Stripe
- [ ] Instalar librería: `npm install stripe @stripe/stripe-js`
- [ ] Configurar variables de entorno de Stripe

### 4.2 Planes de membresía

- [ ] Plan Básico: 8 clases/mes
- [ ] Plan Premium: clases ilimitadas
- [ ] Plan Trimestral: descuento 15%
- [ ] Plan Anual: descuento 25%

### 4.3 Flujo de pago

- [ ] Página de precios (`/precios`)
- [ ] Checkout con Stripe
- [ ] Webhook: activar membresía al pagar
- [ ] Webhook: cancelar membresía al expirar
- [ ] Portal de cliente Stripe (cambiar plan, ver facturas)

### 4.4 Guard de reservas

- [ ] Verificar membresía activa antes de reservar
- [ ] Contador de clases restantes si es plan limitado
- [ ] Mensaje claro si membresía expirada

---

## 🛠️ FASE 5 — Panel de Administración

> Objetivo: El admin puede gestionar todo desde un panel

### 5.1 Dashboard admin (`/admin`)

- [ ] Resumen: alumnos activos, ingresos, clases hoy
- [ ] Gráfico de reservas por semana
- [ ] Gráfico de ingresos por mes

### 5.2 Gestión de clases

- [ ] Crear clase nueva
- [ ] Editar clase existente
- [ ] Cancelar clase (notifica a alumnos)
- [ ] Ver lista de alumnos apuntados

### 5.3 Gestión de alumnos

- [ ] Lista de todos los alumnos
- [ ] Ver perfil y membresía de cada alumno
- [ ] Activar/desactivar cuenta

### 5.4 Gestión de instructores

- [ ] Añadir instructor
- [ ] Asignar clases a instructor
- [ ] Ver horario del instructor

---

## 🧪 FASE 6 — Testing & Calidad

> Objetivo: App robusta y sin bugs en producción

### 6.1 Tests unitarios (Vitest)

- [ ] Instalar Vitest + Testing Library
- [ ] Tests de servicios: booking, membership
- [ ] Tests de validaciones Zod
- [ ] Tests de utilidades

### 6.2 Tests E2E (Playwright)

- [ ] Instalar Playwright
- [ ] Test: flujo completo de reserva
- [ ] Test: flujo de pago con Stripe
- [ ] Test: login y logout

### 6.3 CI/CD con GitHub Actions

- [ ] Crear `.github/workflows/ci.yml`
- [ ] En cada PR: lint + tests automáticos
- [ ] En merge a main: deploy automático a Vercel

---

## 🔒 FASE 7 — Seguridad & Producción

> Objetivo: App segura lista para usuarios reales

### 7.1 Seguridad

- [ ] Instalar Upstash Redis
- [ ] Rate limiting en todos los endpoints
- [ ] Headers de seguridad en `next.config.ts`
- [ ] Protección CSRF
- [ ] Sanitización de inputs
- [ ] Row Level Security (RLS) en Supabase

### 7.2 Performance

- [ ] Optimización de imágenes con Next/Image
- [ ] Lazy loading de componentes pesados
- [ ] Caché de consultas frecuentes con Redis

### 7.3 Monitoreo

- [ ] Configurar Sentry (errores en producción)
- [ ] Configurar Posthog (analytics)
- [ ] Alertas de errores críticos

### 7.4 Documentación final

- [ ] README.md profesional con screenshots
- [ ] Guía de instalación local
- [ ] Documentación de la API
- [ ] CONTRIBUTING.md

---

## 📋 Convención de Commits

\`\`\`
feat: nueva funcionalidad
fix: corrección de bug
chore: configuración, dependencias
docs: documentación
style: formato, sin cambio de lógica
refactor: refactorización de código
test: añadir o modificar tests
\`\`\`

## 🌿 Estrategia de Ramas

\`\`\`
main → producción (solo merge desde develop)
develop → integración
feature/xxx → nueva funcionalidad
fix/xxx → corrección de bug
\`\`\`

## 📁 Estructura de Carpetas

\`\`\`
namaste-yoga/
├── .github/workflows/ → CI/CD
├── prisma/
│ ├── schema.prisma → modelos de BD
│ ├── migrations/ → historial de cambios
│ └── seed.ts → datos de prueba
├── src/
│ ├── app/
│ │ ├── (auth)/ → login, register
│ │ ├── (dashboard)/ → área privada alumno
│ │ ├── (admin)/ → panel administrador
│ │ └── api/ → endpoints API
│ ├── components/
│ │ ├── ui/ → shadcn/ui base
│ │ ├── booking/ → calendario, cards
│ │ ├── admin/ → tablas, gestión
│ │ └── layouts/ → navbar, sidebar
│ ├── lib/
│ │ ├── db.ts → cliente Prisma
│ │ ├── auth.ts → configuración Auth.js
│ │ ├── stripe.ts → cliente Stripe
│ │ └── validations.ts → schemas Zod
│ ├── hooks/ → custom hooks
│ └── types/ → tipos TypeScript
├── tests/
│ ├── unit/ → Vitest
│ └── e2e/ → Playwright
├── .env → variables locales (no subir)
├── .env.example → plantilla (sí subir)
└── ROADMAP.md → esta guía
\`\`\`
