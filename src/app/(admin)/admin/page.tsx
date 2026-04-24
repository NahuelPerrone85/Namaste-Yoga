import { auth } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import CreateClassButton from '@/components/admin/CreateClassButton';
import ClassManagerList from '@/components/admin/ClassManagerList';
import CoachManager from '@/components/admin/CoachManager';
import ProductManager from '@/components/admin/ProductManager';
import CashSaleManager from '@/components/admin/CashSaleManager';
import SalesHistory from '@/components/admin/SalesHistory';

export default async function AdminPage() {
  const session = await auth();

  if (!session || !session.user) {
    redirect('/login');
  }

  if ((session.user as { role?: string }).role !== 'ADMIN') {
    redirect('/dashboard');
  }

  const totalUsers = await db.user.count({ where: { role: 'MEMBER' } });
  const totalBookings = await db.booking.count({
    where: { status: 'CONFIRMED' },
  });
  const totalRevenue = await db.payment.aggregate({
    where: { status: 'COMPLETED' },
    _sum: { amount: true },
  });
  const activeMemberships = await db.userMembership.count({
    where: { isActive: true, endDate: { gte: new Date() } },
  });

  const recentBookings = await db.booking.findMany({
    where: { status: 'CONFIRMED' },
    include: {
      user: { select: { name: true, email: true } },
      class: {
        include: {
          classType: true,
          instructor: { include: { user: { select: { name: true } } } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  const today = new Date();
  const todayStart = new Date(today.setHours(0, 0, 0, 0));
  const todayEnd = new Date(today.setHours(23, 59, 59, 999));

  const todayClasses = await db.class.findMany({
    where: {
      startTime: { gte: todayStart, lte: todayEnd },
      status: 'SCHEDULED',
    },
    include: {
      classType: true,
      instructor: { include: { user: { select: { name: true } } } },
      bookings: { where: { status: 'CONFIRMED' } },
    },
    orderBy: { startTime: 'asc' },
  });

  const classTypes = await db.classType.findMany();
  const instructors = await db.instructor.findMany({
    include: { user: { select: { name: true } } },
  });

  const upcomingClasses = await db.class.findMany({
    where: { startTime: { gte: new Date() } },
    include: {
      classType: true,
      instructor: { include: { user: { select: { name: true } } } },
      bookings: { where: { status: 'CONFIRMED' }, select: { id: true } },
    },
    orderBy: { startTime: 'asc' },
    take: 20,
  });

  const allInstructors = await db.instructor.findMany({
    include: {
      user: {
        select: { id: true, name: true, email: true, image: true, bio: true },
      },
      classes: { where: { status: 'SCHEDULED' }, select: { id: true } },
    },
  });
  const products = await db.product.findMany({
    where: { isActive: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#FDFAF5',
        padding: '40px 24px',
      }}
    >
      <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '40px',
          }}
        >
          <div>
            <h1
              style={{
                fontSize: '32px',
                fontWeight: '700',
                color: '#3D3530',
                letterSpacing: '-0.5px',
                marginBottom: '4px',
              }}
            >
              Panel de administración ⚙️
            </h1>
            <p style={{ fontSize: '14px', color: '#9E8E82' }}>
              Bienvenido, {session.user.name}
            </p>
          </div>
        </div>

        {/* Stats */}
        <div className="grid-4" style={{ marginBottom: '40px' }}>
          {[
            {
              label: 'Alumnos',
              value: totalUsers,
              emoji: '👥',
              color: '#EDE9F8',
              textColor: '#7C6BC4',
            },
            {
              label: 'Reservas activas',
              value: totalBookings,
              emoji: '📅',
              color: '#EAF2EA',
              textColor: '#769F76',
            },
            {
              label: 'Membresías activas',
              value: activeMemberships,
              emoji: '✨',
              color: '#F5EDE0',
              textColor: '#C4A882',
            },
            {
              label: 'Ingresos totales',
              value: `${totalRevenue._sum.amount?.toFixed(2) || '0'}€`,
              emoji: '💰',
              color: '#EDE9F8',
              textColor: '#7C6BC4',
            },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                backgroundColor: stat.color,
                borderRadius: '16px',
                padding: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '8px',
                }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '600',
                    color: stat.textColor,
                    letterSpacing: '0.5px',
                  }}
                >
                  {stat.label.toUpperCase()}
                </span>
                <span style={{ fontSize: '20px' }}>{stat.emoji}</span>
              </div>
              <p
                style={{
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#3D3530',
                  lineHeight: '1',
                }}
              >
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Clases hoy + Últimas reservas */}
        <div className="grid-admin-2" style={{ marginBottom: '40px' }}>
          {/* Clases de hoy */}
          <div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#3D3530',
                marginBottom: '16px',
              }}
            >
              Clases de hoy
            </h2>
            {todayClasses.length === 0 ? (
              <div
                style={{
                  backgroundColor: 'white',
                  borderRadius: '16px',
                  padding: '32px',
                  textAlign: 'center',
                  border: '1px solid #EDE8E0',
                }}
              >
                <span
                  style={{
                    fontSize: '28px',
                    display: 'block',
                    marginBottom: '8px',
                  }}
                >
                  🗓️
                </span>
                <p style={{ fontSize: '13px', color: '#9E8E82' }}>
                  No hay clases hoy
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '10px',
                }}
              >
                {todayClasses.map((yogaClass) => (
                  <div
                    key={yogaClass.id}
                    style={{
                      backgroundColor: 'white',
                      borderRadius: '14px',
                      padding: '16px',
                      border: '1px solid #EDE8E0',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                    }}
                  >
                    <div>
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#3D3530',
                          marginBottom: '2px',
                        }}
                      >
                        {yogaClass.title}
                      </p>
                      <p style={{ fontSize: '12px', color: '#9E8E82' }}>
                        {format(yogaClass.startTime, 'HH:mm', { locale: es })} ·{' '}
                        {yogaClass.instructor.user.name}
                      </p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span
                        style={{
                          fontSize: '11px',
                          fontWeight: '500',
                          color: yogaClass.classType.color,
                          backgroundColor: yogaClass.classType.color + '20',
                          padding: '3px 10px',
                          borderRadius: '20px',
                          display: 'block',
                          marginBottom: '4px',
                        }}
                      >
                        {yogaClass.classType.name}
                      </span>
                      <p style={{ fontSize: '11px', color: '#9E8E82' }}>
                        {yogaClass.bookings.length}/{yogaClass.capacity} plazas
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Últimas reservas */}
          <div>
            <h2
              style={{
                fontSize: '20px',
                fontWeight: '700',
                color: '#3D3530',
                marginBottom: '16px',
              }}
            >
              Últimas reservas
            </h2>
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}
            >
              {recentBookings.map((booking) => (
                <div
                  key={booking.id}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '14px',
                    padding: '16px',
                    border: '1px solid #EDE8E0',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                    }}
                  >
                    <div
                      style={{
                        width: '32px',
                        height: '32px',
                        backgroundColor: '#EDE9F8',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '12px',
                        fontWeight: '700',
                        color: '#7C6BC4',
                        flexShrink: 0,
                      }}
                    >
                      {booking.user.name?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#3D3530',
                          marginBottom: '1px',
                        }}
                      >
                        {booking.user.name}
                      </p>
                      <p style={{ fontSize: '11px', color: '#9E8E82' }}>
                        {booking.class.title} ·{' '}
                        {format(booking.class.startTime, 'd MMM · HH:mm', {
                          locale: es,
                        })}
                      </p>
                    </div>
                  </div>
                  <span
                    style={{
                      fontSize: '11px',
                      fontWeight: '500',
                      color: booking.class.classType.color,
                      backgroundColor: booking.class.classType.color + '20',
                      padding: '3px 10px',
                      borderRadius: '20px',
                      flexShrink: 0,
                    }}
                  >
                    {booking.class.classType.name}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Gestionar clases */}
        <div style={{ marginBottom: '40px' }}>
          <ClassManagerList
            classes={upcomingClasses}
            classTypes={classTypes}
            instructors={instructors}
          />
        </div>

        {/* Gestionar coaches */}
        <div>
          <CoachManager instructors={allInstructors} />
        </div>

        {/* Gestionar productos */}
        <div style={{ marginTop: '40px' }}>
          <ProductManager products={products} />
        </div>

        {/* Venta en efectivo */}
        <div style={{ marginTop: '40px' }}>
          <CashSaleManager products={products} />
        </div>

        {/* Historial de ventas */}
        <div style={{ marginTop: '40px' }}>
          <SalesHistory />
        </div>
      </div>
    </div>
  );
}
