'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Minus, Trash2, ShoppingBag, X } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  image: string | null;
  category: string;
}

interface CartItem {
  productId: string;
  name: string;
  price: number;
  quantity: number;
  stock: number;
}

interface CashSaleManagerProps {
  products: Product[];
}

export default function CashSaleManager({ products }: CashSaleManagerProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [customerName, setCustomerName] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  const filteredProducts = products.filter(
    (p) => p.name.toLowerCase().includes(search.toLowerCase()) && p.stock > 0
  );

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.productId === product.id);
      if (existing) {
        if (existing.quantity >= product.stock) return prev;
        return prev.map((i) =>
          i.productId === product.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: 1,
          stock: product.stock,
        },
      ];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      setCart((prev) => prev.filter((i) => i.productId !== productId));
      return;
    }
    setCart((prev) =>
      prev.map((i) =>
        i.productId === productId
          ? { ...i, quantity: Math.min(quantity, i.stock) }
          : i
      )
    );
  };

  const total = cart.reduce((acc, i) => acc + i.price * i.quantity, 0);

  const handleSale = async () => {
    if (cart.length === 0) return;
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/orders/cash', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: cart.map((i) => ({
            productId: i.productId,
            quantity: i.quantity,
          })),
          customerName: customerName || 'Cliente',
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        return;
      }

      setSuccess(`✅ ${data.message}`);
      setCart([]);
      setCustomerName('');
      router.refresh();
    } catch {
      setError('Error al registrar la venta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#3D3530' }}>
          Venta en efectivo 💵
        </h2>
        <button
          onClick={() => setIsOpen(!isOpen)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            backgroundColor: isOpen ? '#F5F0E8' : '#7c6bc4',
            color: isOpen ? '#6B5B4E' : 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          {isOpen ? <X size={14} /> : <ShoppingBag size={14} />}
          {isOpen ? 'Cerrar' : 'Nueva venta'}
        </button>
      </div>

      {isOpen && (
        // <div style={{ backgroundColor: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #EDE8E0' }}>
        <div
          className="grid-cash-sale"
          style={{ gap: '24px', alignItems: 'stretch' }}
        >
          {/* Productos */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #EDE8E0',
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <p
              style={{
                fontSize: '13px',
                fontWeight: '600',
                color: '#3D3530',
                marginBottom: '12px',
              }}
            >
              Seleccionar productos
            </p>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar producto..."
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                border: '1px solid #EDE8E0',
                fontSize: '13px',
                outline: 'none',
                boxSizing: 'border-box',
                marginBottom: '12px',
              }}
            />
            <div
              style={{
                flex: 1,
                display: 'flex',
                flexDirection: 'column',
                gap: '8px',
                overflowY: 'auto',
                maxHeight: '350px',
              }}
            >
              {filteredProducts.map((product) => {
                const inCart = cart.find((i) => i.productId === product.id);
                return (
                  <div
                    key={product.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      backgroundColor: inCart ? '#EDE9F8' : 'white',
                      borderRadius: '12px',
                      border: `1px solid ${inCart ? '#C4B8E8' : '#EDE8E0'}`,
                    }}
                  >
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                      }}
                    >
                      {product.image ? (
                        <img
                          src={product.image}
                          alt={product.name}
                          style={{
                            width: '40px',
                            height: '40px',
                            borderRadius: '8px',
                            objectFit: 'cover',
                            flexShrink: 0,
                          }}
                        />
                      ) : (
                        <div
                          style={{
                            width: '40px',
                            height: '40px',
                            backgroundColor: '#EDE9F8',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '18px',
                            flexShrink: 0,
                          }}
                        >
                          🛍️
                        </div>
                      )}
                      <div>
                        <p
                          style={{
                            fontSize: '13px',
                            fontWeight: '600',
                            color: '#3D3530',
                            marginBottom: '2px',
                          }}
                        >
                          {product.name}
                        </p>
                        <p style={{ fontSize: '12px', color: '#9E8E82' }}>
                          {product.price.toFixed(2)}€ · {product.stock} en stock
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCart(product)}
                      disabled={inCart?.quantity === product.stock}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '6px 12px',
                        backgroundColor: inCart ? '#7C6BC4' : '#EDE9F8',
                        color: inCart ? 'white' : '#7C6BC4',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      <Plus size={12} />
                      {inCart ? `${inCart.quantity} añadido` : 'Añadir'}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Carrito / Resumen */}
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '16px',
              padding: '20px',
              border: '1px solid #EDE8E0',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            <p
              style={{ fontSize: '13px', fontWeight: '600', color: '#3D3530' }}
            >
              Resumen de venta
            </p>

            <div>
              <label
                style={{
                  display: 'block',
                  fontSize: '12px',
                  fontWeight: '500',
                  color: '#6B5B4E',
                  marginBottom: '6px',
                }}
              >
                Nombre del cliente (opcional)
              </label>
              <input
                type="text"
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Ej: Juan García"
                style={{
                  width: '100%',
                  padding: '10px 14px',
                  borderRadius: '10px',
                  border: '1px solid #EDE8E0',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </div>

            <div style={{ flex: 1, overflowY: 'auto', maxHeight: '220px' }}>
              {cart.length === 0 ? (
                <div
                  style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '24px',
                    textAlign: 'center',
                    border: '1px solid #EDE8E0',
                  }}
                >
                  <p style={{ fontSize: '13px', color: '#9E8E82' }}>
                    Añade productos para comenzar
                  </p>
                </div>
              ) : (
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px',
                  }}
                >
                  {cart.map((item) => (
                    <div
                      key={item.productId}
                      style={{
                        backgroundColor: 'white',
                        borderRadius: '10px',
                        padding: '10px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '8px',
                        border: '1px solid #EDE8E0',
                      }}
                    >
                      <p
                        style={{
                          fontSize: '12px',
                          fontWeight: '600',
                          color: '#3D3530',
                          flex: 1,
                        }}
                      >
                        {item.name}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <button
                          onClick={() =>
                            updateQuantity(item.productId, item.quantity - 1)
                          }
                          style={{
                            width: '22px',
                            height: '22px',
                            backgroundColor: '#F5F0E8',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Minus size={10} color="#6B5B4E" />
                        </button>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: '700',
                            color: '#3D3530',
                            minWidth: '16px',
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
                            width: '22px',
                            height: '22px',
                            backgroundColor: '#F5F0E8',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <Plus size={10} color="#6B5B4E" />
                        </button>
                        <span
                          style={{
                            fontSize: '12px',
                            fontWeight: '600',
                            color: '#7C6BC4',
                            minWidth: '48px',
                            textAlign: 'right',
                          }}
                        >
                          {(item.price * item.quantity).toFixed(2)}€
                        </span>
                        <button
                          onClick={() =>
                            setCart((prev) =>
                              prev.filter((i) => i.productId !== item.productId)
                            )
                          }
                          style={{
                            background: 'none',
                            border: 'none',
                            cursor: 'pointer',
                            color: '#DC2626',
                          }}
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div
                style={{
                  backgroundColor: '#EDE9F8',
                  borderRadius: '12px',
                  padding: '14px 16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <span
                  style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#3D3530',
                  }}
                >
                  Total
                </span>
                <span
                  style={{
                    fontSize: '22px',
                    fontWeight: '700',
                    color: '#7C6BC4',
                  }}
                >
                  {total.toFixed(2)}€
                </span>
              </div>
            )}

            {error && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  borderRadius: '10px',
                  padding: '10px 14px',
                }}
              >
                <p style={{ fontSize: '12px', color: '#DC2626' }}>{error}</p>
              </div>
            )}

            {success && (
              <div
                style={{
                  backgroundColor: '#EAF2EA',
                  borderRadius: '10px',
                  padding: '10px 14px',
                }}
              >
                <p style={{ fontSize: '12px', color: '#769F76' }}>{success}</p>
              </div>
            )}

            <button
              onClick={handleSale}
              disabled={cart.length === 0 || loading}
              style={{
                width: '100%',
                padding: '13px',
                backgroundColor: cart.length === 0 ? '#F5F0E8' : '#8FAF8F',
                color: cart.length === 0 ? '#9E8E82' : 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: cart.length === 0 ? 'not-allowed' : 'pointer',
                marginTop: 'auto',
              }}
            >
              {loading
                ? 'Registrando...'
                : `Registrar venta ${cart.length > 0 ? `· ${total.toFixed(2)}€` : ''}`}
            </button>
          </div>
        </div>
        // </div>
      )}
    </div>
  );
}
