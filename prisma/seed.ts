import {
  PrismaClient,
  Role,
  ClassStatus,
  MembershipType,
} from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Tipos de clase
  const hatha = await prisma.classType.upsert({
    where: { name: 'Hatha Yoga' },
    update: {},
    create: {
      name: 'Hatha Yoga',
      description: 'Yoga tradicional, ideal para principiantes',
      color: '#6366f1',
    },
  });

  const vinyasa = await prisma.classType.upsert({
    where: { name: 'Vinyasa Flow' },
    update: {},
    create: {
      name: 'Vinyasa Flow',
      description: 'Yoga dinámico con movimiento fluido',
      color: '#f59e0b',
    },
  });

  const yin = await prisma.classType.upsert({
    where: { name: 'Yin Yoga' },
    update: {},
    create: {
      name: 'Yin Yoga',
      description: 'Yoga suave y relajante, posturas largas',
      color: '#10b981',
    },
  });

  console.log('✅ Tipos de clase creados');

  // Membresías
  await prisma.membership.upsert({
    where: { type: MembershipType.BASIC },
    update: {},
    create: {
      name: 'Plan Básico',
      type: MembershipType.BASIC,
      description: '8 clases al mes',
      price: 49.99,
      duration: 30,
      classLimit: 8,
    },
  });

  await prisma.membership.upsert({
    where: { type: MembershipType.PREMIUM },
    update: {},
    create: {
      name: 'Plan Premium',
      type: MembershipType.PREMIUM,
      description: 'Clases ilimitadas',
      price: 79.99,
      duration: 30,
      classLimit: null,
    },
  });

  await prisma.membership.upsert({
    where: { type: MembershipType.QUARTERLY },
    update: {},
    create: {
      name: 'Plan Trimestral',
      type: MembershipType.QUARTERLY,
      description: 'Clases ilimitadas 3 meses - 15% descuento',
      price: 199.99,
      duration: 90,
      classLimit: null,
    },
  });

  await prisma.membership.upsert({
    where: { type: MembershipType.ANNUAL },
    update: {},
    create: {
      name: 'Plan Anual',
      type: MembershipType.ANNUAL,
      description: 'Clases ilimitadas 12 meses - 25% descuento',
      price: 699.99,
      duration: 365,
      classLimit: null,
    },
  });

  console.log('✅ Membresías creadas');

  // Usuarios instructores
  const instructor1 = await prisma.user.upsert({
    where: { email: 'ana@namaste-yoga.com' },
    update: {},
    create: {
      name: 'Ana García',
      email: 'ana@namaste-yoga.com',
      role: Role.INSTRUCTOR,
      instructor: {
        create: {
          bio: 'Instructora certificada con 10 años de experiencia',
          specialty: ['Hatha Yoga', 'Meditación'],
        },
      },
    },
    include: { instructor: true },
  });

  const instructor2 = await prisma.user.upsert({
    where: { email: 'carlos@namaste-yoga.com' },
    update: {},
    create: {
      name: 'Carlos Ruiz',
      email: 'carlos@namaste-yoga.com',
      role: Role.INSTRUCTOR,
      instructor: {
        create: {
          bio: 'Especialista en Vinyasa y Ashtanga',
          specialty: ['Vinyasa Flow', 'Ashtanga'],
        },
      },
    },
    include: { instructor: true },
  });

  console.log('✅ Instructores creados');

  // Clases para esta semana
  const today = new Date();

  const classes = [
    {
      title: 'Hatha Yoga Mañana',
      startHour: 8,
      startMin: 0,
      duration: 60,
      capacity: 12,
      classTypeId: hatha.id,
      instructorId: instructor1.instructor!.id,
      daysFromNow: 0,
    },
    {
      title: 'Vinyasa Flow',
      startHour: 10,
      startMin: 0,
      duration: 75,
      capacity: 10,
      classTypeId: vinyasa.id,
      instructorId: instructor2.instructor!.id,
      daysFromNow: 0,
    },
    {
      title: 'Yin Yoga Tarde',
      startHour: 18,
      startMin: 30,
      duration: 90,
      capacity: 15,
      classTypeId: yin.id,
      instructorId: instructor1.instructor!.id,
      daysFromNow: 1,
    },
    {
      title: 'Hatha Yoga Principiantes',
      startHour: 9,
      startMin: 0,
      duration: 60,
      capacity: 10,
      classTypeId: hatha.id,
      instructorId: instructor1.instructor!.id,
      daysFromNow: 2,
    },
    {
      title: 'Vinyasa Avanzado',
      startHour: 19,
      startMin: 0,
      duration: 75,
      capacity: 8,
      classTypeId: vinyasa.id,
      instructorId: instructor2.instructor!.id,
      daysFromNow: 3,
    },
  ];

  for (const c of classes) {
    const startTime = new Date(today);
    startTime.setDate(today.getDate() + c.daysFromNow);
    startTime.setHours(c.startHour, c.startMin, 0, 0);

    const endTime = new Date(startTime);
    endTime.setMinutes(endTime.getMinutes() + c.duration);

    await prisma.class.create({
      data: {
        title: c.title,
        startTime,
        endTime,
        capacity: c.capacity,
        status: ClassStatus.SCHEDULED,
        classTypeId: c.classTypeId,
        instructorId: c.instructorId,
      },
    });
  }

  console.log('✅ Clases creadas');
  // Productos de ejemplo
  const products = [
    {
      name: 'Mat de Yoga Premium',
      description:
        'Mat antideslizante de 6mm de grosor, ideal para todo tipo de práctica.',
      price: 49.99,
      stock: 20,
      category: 'EQUIPAMIENTO' as const,
      image:
        'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?w=500',
    },
    {
      name: 'Bloque de Yoga',
      description:
        'Bloque de espuma de alta densidad para mejorar tu alineación.',
      price: 12.99,
      stock: 30,
      category: 'ACCESORIOS' as const,
      image: 'https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=500',
    },
    {
      name: 'Camiseta Shanti',
      description: 'Camiseta 100% algodón orgánico con el logo de Shanti.',
      price: 29.99,
      stock: 15,
      category: 'ROPA' as const,
      image:
        'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=500',
    },
    {
      name: 'Correa de Yoga',
      description: 'Correa de algodón resistente para mejorar tu flexibilidad.',
      price: 8.99,
      stock: 25,
      category: 'ACCESORIOS' as const,
      image:
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500',
    },
    {
      name: 'Bolsa de Yoga',
      description: 'Bolsa de lona con compartimento para mat y accesorios.',
      price: 34.99,
      stock: 10,
      category: 'ACCESORIOS' as const,
      image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=500',
    },
    {
      name: 'Leggings Shanti',
      description:
        'Leggings de alta elasticidad para máxima libertad de movimiento.',
      price: 44.99,
      stock: 12,
      category: 'ROPA' as const,
      image:
        'https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=500',
    },
  ];

  for (const product of products) {
    await prisma.product.upsert({
      where: { id: product.name },
      update: {},
      create: product,
    });
  }

  console.log('✅ Productos creados');
  console.log('🎉 Seed completado');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
