'use client';

import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  category: string;
}

interface ShopClientProps {
  products: Product[];
}

const categoryLabels: Record<string, string> = {
  TODOS: 'Todos',
  ROPA: '👕 Ropa',
  ACCESORIOS: '🎒 Accesorios',
  EQUIPAMIENTO: '🧘 Equipamiento',
  NUTRICION: '🥗 Nutrición',
  OTROS: '✨ Otros',
};

export default function ShopClient({ products }: ShopClientProps) {
  const { addItem, items } = useCart();
  const [selectedCategory, setSelectedCategory] = useState('TODOS');
  const [addedIds, setAddedIds] = useState<string[]>([]);

  const categories = [
    'TODOS',
    ...Array.from(new Set(products.map((p) => p.category))),
  ];

  const filteredProducts =
    selectedCategory === 'TODOS'
      ? products
      : products.filter((p) => p.category === selectedCategory);

  const handleAddToCart = (product: Product) => {
    addItem({
      productId: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      stock: product.stock,
    });

    setAddedIds((prev) => [...prev, product.id]);
    setTimeout(() => {
      setAddedIds((prev) => prev.filter((id) => id !== product.id));
    }, 1500);
  };

  const isInCart = (productId: string) =>
    items.some((i) => i.productId === productId);

  return (
    <div>
      {/* Filtros por categoría */}
      <div
        style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '32px',
        }}
      >
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 16px',
              borderRadius: '20px',
              border: 'none',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
              backgroundColor: selectedCategory === cat ? '#7C6BC4' : 'white',
              color: selectedCategory === cat ? 'white' : '#6B5B4E',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              transition: 'all 0.15s',
            }}
          >
            {categoryLabels[cat] || cat}
          </button>
        ))}
      </div>

      {/* Grid de productos */}
      {filteredProducts.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '64px',
            backgroundColor: 'white',
            borderRadius: '20px',
            border: '1px solid #EDE8E0',
          }}
        >
          <span
            style={{ fontSize: '40px', display: 'block', marginBottom: '16px' }}
          >
            🛍️
          </span>
          <p style={{ color: '#9E8E82' }}>No hay productos en esta categoría</p>
        </div>
      ) : (
        <div className="grid-3" style={{ gap: '20px' }}>
          {filteredProducts.map((product) => {
            const isAdded = addedIds.includes(product.id);
            const inCart = isInCart(product.id);
            const outOfStock = product.stock === 0;

            return (
              <div
                key={product.id}
                style={{
                  backgroundColor: 'white',
                  borderRadius: '20px',
                  border: '1px solid #EDE8E0',
                  overflow: 'hidden',
                  boxShadow: '0 4px 20px rgba(0,0,0,0.04)',
                  display: 'flex',
                  flexDirection: 'column',
                }}
              >
                {/* Imagen */}
                <div
                  style={{
                    position: 'relative',
                    height: '200px',
                    backgroundColor: '#F5F0E8',
                    overflow: 'hidden',
                  }}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                  ) : (
                    <div
                      style={{
                        width: '100%',
                        height: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '48px',
                      }}
                    >
                      🛍️
                    </div>
                  )}

                  {/* Badge categoría */}
                  <div
                    style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      backgroundColor: 'white',
                      borderRadius: '20px',
                      padding: '4px 10px',
                      fontSize: '11px',
                      fontWeight: '500',
                      color: '#7C6BC4',
                    }}
                  >
                    {categoryLabels[product.category] || product.category}
                  </div>

                  {/* Badge sin stock */}
                  {outOfStock && (
                    <div
                      style={{
                        position: 'absolute',
                        inset: 0,
                        backgroundColor: 'rgba(0,0,0,0.4)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <span
                        style={{
                          backgroundColor: 'white',
                          color: '#DC2626',
                          fontSize: '13px',
                          fontWeight: '700',
                          padding: '6px 16px',
                          borderRadius: '20px',
                        }}
                      >
                        Sin stock
                      </span>
                    </div>
                  )}
                </div>

                {/* Info */}
                <div
                  style={{
                    padding: '20px',
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <h3
                    style={{
                      fontSize: '15px',
                      fontWeight: '700',
                      color: '#3D3530',
                      marginBottom: '6px',
                    }}
                  >
                    {product.name}
                  </h3>
                  {product.description && (
                    <p
                      style={{
                        fontSize: '13px',
                        color: '#9E8E82',
                        lineHeight: '1.5',
                        marginBottom: '12px',
                        flex: 1,
                      }}
                    >
                      {product.description}
                    </p>
                  )}

                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginTop: 'auto',
                    }}
                  >
                    <div>
                      <span
                        style={{
                          fontSize: '20px',
                          fontWeight: '700',
                          color: '#3D3530',
                        }}
                      >
                        {product.price.toFixed(2)}€
                      </span>
                      <p
                        style={{
                          fontSize: '11px',
                          color: product.stock <= 3 ? '#D97706' : '#9E8E82',
                          marginTop: '2px',
                        }}
                      >
                        {outOfStock
                          ? 'Sin stock'
                          : product.stock <= 3
                            ? `Solo ${product.stock} disponibles`
                            : `${product.stock} disponibles`}
                      </p>
                    </div>

                    <button
                      onClick={() => !outOfStock && handleAddToCart(product)}
                      disabled={outOfStock}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '10px 16px',
                        backgroundColor: isAdded
                          ? '#8FAF8F'
                          : inCart
                            ? '#EDE9F8'
                            : outOfStock
                              ? '#F5F0E8'
                              : '#7C6BC4',
                        color: isAdded
                          ? 'white'
                          : inCart
                            ? '#7C6BC4'
                            : outOfStock
                              ? '#9E8E82'
                              : 'white',
                        border: 'none',
                        borderRadius: '10px',
                        fontSize: '13px',
                        fontWeight: '600',
                        cursor: outOfStock ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s',
                      }}
                    >
                      {isAdded ? (
                        <>
                          <Check size={14} /> Añadido
                        </>
                      ) : inCart ? (
                        <>
                          <ShoppingCart size={14} /> En carrito
                        </>
                      ) : (
                        <>
                          <ShoppingCart size={14} /> Añadir
                        </>
                      )}
                    </button>
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
