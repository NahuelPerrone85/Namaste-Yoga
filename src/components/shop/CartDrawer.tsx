'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, X, Plus, Minus, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function CartDrawer() {
  const { items, removeItem, updateQuantity, total, itemCount, clearCart } =
    useCart();
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCheckout = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/orders/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: items.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.error);
        return;
      }

      clearCart();
      router.push(data.url);
    } catch {
      alert('Error al procesar el pago');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Botón carrito */}
      <button
        onClick={() => setIsOpen(true)}
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          padding: '8px 14px',
          backgroundColor: '#EDE9F8',
          border: 'none',
          borderRadius: '10px',
          cursor: 'pointer',
          color: '#7C6BC4',
          fontWeight: '600',
          fontSize: '13px',
        }}
      >
        <ShoppingCart size={16} />
        Carrito
        {itemCount > 0 && (
          <span
            style={{
              position: 'absolute',
              top: '-6px',
              right: '-6px',
              backgroundColor: '#7C6BC4',
              color: 'white',
              borderRadius: '50%',
              width: '18px',
              height: '18px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '10px',
              fontWeight: '700',
            }}
          >
            {itemCount}
          </span>
        )}
      </button>

      {/* Overlay */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0,0,0,0.3)',
            zIndex: 100,
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : '-420px',
          width: '420px',
          maxWidth: '100vw',
          height: '100vh',
          backgroundColor: '#FDFAF5',
          zIndex: 101,
          transition: 'right 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '-4px 0 24px rgba(0,0,0,0.1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px 24px',
            borderBottom: '1px solid #EDE8E0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <ShoppingCart size={18} color="#7C6BC4" />
            <h2
              style={{ fontSize: '16px', fontWeight: '700', color: '#3D3530' }}
            >
              Mi carrito {itemCount > 0 && `(${itemCount})`}
            </h2>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: '#9E8E82',
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px 24px' }}>
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px 0' }}>
              <span
                style={{
                  fontSize: '40px',
                  display: 'block',
                  marginBottom: '16px',
                }}
              >
                🛒
              </span>
              <p
                style={{
                  fontSize: '15px',
                  fontWeight: '500',
                  color: '#3D3530',
                  marginBottom: '8px',
                }}
              >
                Tu carrito está vacío
              </p>
              <p style={{ fontSize: '13px', color: '#9E8E82' }}>
                Añade productos de nuestra tienda
              </p>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  marginTop: '20px',
                  padding: '10px 20px',
                  backgroundColor: '#7C6BC4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                Ver tienda
              </button>
            </div>
          ) : (
            <div
              style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}
            >
              {items.map((item) => (
                <div
                  key={item.productId}
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '14px',
                    padding: '14px',
                    border: '1px solid #EDE8E0',
                    display: 'flex',
                    gap: '12px',
                  }}
                >
                  {/* Imagen */}
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        borderRadius: '10px',
                        objectFit: 'cover',
                        flexShrink: 0,
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#EDE9F8',
                        borderRadius: '10px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '24px',
                        flexShrink: 0,
                      }}
                    >
                      🛍️
                    </div>
                  )}

                  {/* Info */}
                  <div style={{ flex: 1 }}>
                    <p
                      style={{
                        fontSize: '13px',
                        fontWeight: '600',
                        color: '#3D3530',
                        marginBottom: '2px',
                      }}
                    >
                      {item.name}
                    </p>
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: '700',
                        color: '#7C6BC4',
                        marginBottom: '8px',
                      }}
                    >
                      {item.price.toFixed(2)}€
                    </p>

                    {/* Cantidad */}
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                      }}
                    >
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity - 1)
                        }
                        style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#F5F0E8',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Minus size={12} color="#6B5B4E" />
                      </button>
                      <span
                        style={{
                          fontSize: '13px',
                          fontWeight: '600',
                          color: '#3D3530',
                          minWidth: '20px',
                          textAlign: 'center',
                        }}
                      >
                        {item.quantity}
                      </span>
                      <button
                        onClick={() =>
                          updateQuantity(item.productId, item.quantity + 1)
                        }
                        disabled={item.quantity >= item.stock}
                        style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#F5F0E8',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                      >
                        <Plus size={12} color="#6B5B4E" />
                      </button>
                      <button
                        onClick={() => removeItem(item.productId)}
                        style={{
                          marginLeft: 'auto',
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#DC2626',
                        }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div style={{ padding: '20px 24px', borderTop: '1px solid #EDE8E0' }}>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                marginBottom: '16px',
              }}
            >
              <span style={{ fontSize: '15px', color: '#6B5B4E' }}>Total</span>
              <span
                style={{
                  fontSize: '20px',
                  fontWeight: '700',
                  color: '#3D3530',
                }}
              >
                {total.toFixed(2)}€
              </span>
            </div>
            <button
              onClick={handleCheckout}
              disabled={loading}
              style={{
                width: '100%',
                padding: '14px',
                backgroundColor: loading ? '#A598D4' : '#7C6BC4',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: loading ? 'not-allowed' : 'pointer',
                boxShadow: '0 4px 16px rgba(124,107,196,0.35)',
              }}
            >
              {loading ? 'Procesando...' : 'Pagar ahora'}
            </button>
            <button
              onClick={clearCart}
              style={{
                width: '100%',
                padding: '10px',
                backgroundColor: 'transparent',
                color: '#9E8E82',
                border: 'none',
                cursor: 'pointer',
                fontSize: '13px',
                marginTop: '8px',
              }}
            >
              Vaciar carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
