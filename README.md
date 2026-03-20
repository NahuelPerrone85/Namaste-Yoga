# 🧘 Namaste Yoga — App de Reservas

![Next.js](https://img.shields.io/badge/Next.js-15-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?style=flat-square&logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-5-2D3748?style=flat-square&logo=prisma)
![Stripe](https://img.shields.io/badge/Stripe-Payments-635BFF?style=flat-square&logo=stripe)
![Vercel](https://img.shields.io/badge/Deployed-Vercel-black?style=flat-square&logo=vercel)

Aplicación web full-stack para la gestión y reserva de clases de yoga. Desarrollada con las tecnologías más demandadas del mercado en 2026.

🌐 **Demo en vivo**: [namaste-yoga.vercel.app](https://namaste-yoga.vercel.app)

---

## ✨ Funcionalidades

- 🔐 **Autenticación segura** — Registro y login con email/contraseña, JWT y sesiones
- 📅 **Calendario de clases** — Vista semanal con navegación, filtros y disponibilidad en tiempo real
- ✅ **Sistema de reservas** — Reservar, cancelar y re-reservar clases con política de cancelación
- 💳 **Pagos con Stripe** — 4 planes de membresía con checkout seguro y webhooks automáticos
- 👤 **Dashboard personal** — Próximas clases, membresía activa y estadísticas
- 🛡️ **Seguridad** — Middleware de protección de rutas, RBAC y validación con Zod

---

## 🛠️ Stack Tecnológico

| Categoría     | Tecnología                                      |
| ------------- | ----------------------------------------------- |
| Frontend      | Next.js 15, TypeScript, Tailwind CSS, shadcn/ui |
| Backend       | Next.js API Routes                              |
| Base de datos | PostgreSQL (Supabase) + Prisma ORM              |
| Autenticación | Auth.js v5                                      |
| Pagos         | Stripe                                          |
| Deploy        | Vercel                                          |
| CI/CD         | GitHub Actions                                  |

---

## 🚀 Instalación local

### Requisitos previos

- Node.js v20 o superior
- Cuenta en [Supabase](https://supabase.com) (gratuita)
- Cuenta en [Stripe](https://stripe.com) (gratuita)

### Pasos

**1. Clonar el repositorio**

```bash
git clone https://github.com/NahuelPerrone85/Namaste-Yoga.git
cd Namaste-Yoga
```

**2. Instalar dependencias**

```bash
npm install
```

**3. Configurar variables de entorno**

```bash
cp .env.example .env.local
```

Rellena todas las variables en `.env.local` con tus credenciales.

**4. Configurar la base de datos**

```bash
npx prisma migrate dev
npx prisma db seed
```

**5. Arrancar el servidor**

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

---

## 📁 Estructura del proyecto

```
namaste-yoga/
├── prisma/
│   ├── schema.prisma      # Modelos de base de datos
│   ├── migrations/        # Historial de migraciones
│   └── seed.ts            # Datos de prueba
├── src/
│   ├── app/
│   │   ├── (auth)/        # Páginas públicas: login, registro
│   │   ├── (dashboard)/   # Páginas privadas: dashboard, clases, precios
│   │   └── api/           # API Routes: auth, bookings, classes, stripe
│   ├── components/
│   │   ├── booking/       # Calendario, cards de clases, precios
│   │   ├── layouts/       # Navbar, SessionProvider
│   │   └── ui/            # Componentes shadcn/ui
│   └── lib/
│       ├── auth.ts        # Configuración Auth.js
│       ├── db.ts          # Cliente Prisma
│       └── stripe.ts      # Cliente Stripe
├── .env.example           # Plantilla de variables de entorno
└── ROADMAP.md             # Guía de desarrollo
```

---

## 🗄️ Modelo de base de datos

```
User ──────── Booking ──────── Class
  │                              │
  │                         ClassType
  │                              │
UserMembership              Instructor
  │
Membership
  │
Payment
```

---

## 🔑 Variables de entorno

```env
# Base de datos
DATABASE_URL=
DIRECT_URL=

# Auth.js
NEXTAUTH_SECRET=
NEXTAUTH_URL=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=
```

---

## 📜 Scripts disponibles

```bash
npm run dev          # Servidor de desarrollo
npm run build        # Build de producción
npm run lint         # Linter
npm run format       # Formatear código
npm run db:migrate   # Ejecutar migraciones
npm run db:seed      # Poblar base de datos
npm run db:studio    # Abrir Prisma Studio
```

---

## 🌿 Flujo de trabajo con Git

```
main          → producción
develop       → integración
feature/xxx   → nueva funcionalidad
fix/xxx       → corrección de bug
docs/xxx      → documentación
```

---

## 👨‍💻 Autor

**Nahuel Perrone**

- GitHub: [@NahuelPerrone85](https://github.com/NahuelPerrone85)

---

## 📄 Licencia

MIT License — siéntete libre de usar este proyecto como referencia.
