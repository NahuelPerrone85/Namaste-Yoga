'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OrderItem {
  id: string;
  quantity: number;
  price: number;
  product: { name: string };
}

interface Order {
  id: string;
  total: number;
  createdAt: string;
  stripePaymentId: string | null;
  user: { name: string | null; email: string | null };
  orderItems: OrderItem[];
}

export default function SalesHistory() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'ALL' | 'CASH' | 'CARD'>('ALL');

  useEffect(() => {
    fetch('/api/orders')
      .then((res) => res.json())
      .then((data) => {
        setOrders(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const isCardPayment = (order: Order) => !!order.stripePaymentId;
  const isCashPayment = (order: Order) =>
    order.user?.email === 'efectivo@shanti.com';

  const filteredOrders = orders.filter((o) => {
    if (filter === 'CARD') return isCardPayment(o);
    if (filter === 'CASH') return isCashPayment(o);
    return true;
  });

  const totalCard = orders
    .filter(isCardPayment)
    .reduce((acc, o) => acc + o.total, 0);

  const totalCash = orders
    .filter(isCashPayment)
    .reduce((acc, o) => acc + o.total, 0);

  const totalAll = totalCard + totalCash;

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '32px', color: '#9E8E82' }}>
        Cargando ventas...
      </div>
    );
  }

  return (
    <div>
      <h2
        style={{
          fontSize: '18px',
          fontWeight: '700',
          color: '#3D3530',
          marginBottom: '20px',
        }}
      >
        Historial de ventas 📊
      </h2>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: '24px', gap: '16px' }}>
        <div
          style={{
            backgroundColor: '#EDE9F8',
            borderRadius: '16px',
            padding: '20px',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#7C6BC4',
              letterSpacing: '0.5px',
              marginBottom: '8px',
            }}
          >
            TOTAL VENTAS
          </p>
          <p
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#3D3530',
              lineHeight: '1',
            }}
          >
            {totalAll.toFixed(2)}€
          </p>
          <p style={{ fontSize: '12px', color: '#9E8E82', marginTop: '4px' }}>
            {orders.length} pedidos
          </p>
        </div>
        <div
          style={{
            backgroundColor: '#EAF2EA',
            borderRadius: '16px',
            padding: '20px',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#769F76',
              letterSpacing: '0.5px',
              marginBottom: '8px',
            }}
          >
            💵 EFECTIVO
          </p>
          <p
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#3D3530',
              lineHeight: '1',
            }}
          >
            {totalCash.toFixed(2)}€
          </p>
          <p style={{ fontSize: '12px', color: '#9E8E82', marginTop: '4px' }}>
            {orders.filter(isCashPayment).length} pedidos
          </p>
        </div>
        <div
          style={{
            backgroundColor: '#F5EDE0',
            borderRadius: '16px',
            padding: '20px',
          }}
        >
          <p
            style={{
              fontSize: '11px',
              fontWeight: '600',
              color: '#C4A882',
              letterSpacing: '0.5px',
              marginBottom: '8px',
            }}
          >
            💳 TARJETA
          </p>
          <p
            style={{
              fontSize: '28px',
              fontWeight: '700',
              color: '#3D3530',
              lineHeight: '1',
            }}
          >
            {totalCard.toFixed(2)}€
          </p>
          <p style={{ fontSize: '12px', color: '#9E8E82', marginTop: '4px' }}>
            {orders.filter(isCardPayment).length} pedidos
          </p>
        </div>
      </div>

      {/* Filtros */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {[
          { value: 'ALL', label: 'Todos' },
          { value: 'CASH', label: '💵 Efectivo' },
          { value: 'CARD', label: '💳 Tarjeta' },
        ].map((f) => (
          <button
            key={f.value}
            onClick={() => setFilter(f.value as 'ALL' | 'CASH' | 'CARD')}
            style={{
              padding: '7px 16px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '12px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: filter === f.value ? '#7C6BC4' : '#F5F0E8',
              color: filter === f.value ? 'white' : '#6B5B4E',
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Lista */}
      {filteredOrders.length === 0 ? (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '16px',
            padding: '32px',
            textAlign: 'center',
            border: '1px solid #EDE8E0',
          }}
        >
          <p style={{ fontSize: '13px', color: '#9E8E82' }}>
            No hay ventas registradas
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {filteredOrders.map((order) => {
            const isCard = isCardPayment(order);
            const isCash = isCashPayment(order);

            return (
              <div
                key={order.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '14px',
                  padding: '16px 20px',
                  border: '1px solid #EDE8E0',
                }}
              >
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    gap: '12px',
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        marginBottom: '4px',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#3D3530',
                        }}
                      >
                        {isCash
                          ? 'Venta en efectivo'
                          : order.user?.name || order.user?.email}
                      </p>
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: '700',
                          padding: '2px 8px',
                          borderRadius: '20px',
                          backgroundColor: isCard ? '#F5EDE0' : '#EAF2EA',
                          color: isCard ? '#C4A882' : '#769F76',
                        }}
                      >
                        {isCard ? '💳 Tarjeta' : '💵 Efectivo'}
                      </span>
                    </div>
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#9E8E82',
                        marginBottom: '8px',
                      }}
                    >
                      {format(new Date(order.createdAt), 'd MMM yyyy · HH:mm', {
                        locale: es,
                      })}
                    </p>
                    <div
                      style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}
                    >
                      {order.orderItems.map((item) => (
                        <span
                          key={item.id}
                          style={{
                            fontSize: '11px',
                            color: '#7C6BC4',
                            backgroundColor: '#EDE9F8',
                            padding: '2px 8px',
                            borderRadius: '20px',
                          }}
                        >
                          {item.quantity}x {item.product.name}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right', flexShrink: 0 }}>
                    <p
                      style={{
                        fontSize: '18px',
                        fontWeight: '700',
                        color: '#3D3530',
                      }}
                    >
                      {order.total.toFixed(2)}€
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
