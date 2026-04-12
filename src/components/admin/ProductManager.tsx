'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  stock: number;
  image: string | null;
  category: string;
  isActive: boolean;
}

interface ProductManagerProps {
  products: Product[];
}

const inputStyle = {
  width: '100%',
  padding: '10px 14px',
  borderRadius: '10px',
  border: '1px solid #EDE8E0',
  fontSize: '13px',
  color: '#3D3530',
  outline: 'none',
  boxSizing: 'border-box' as const,
  backgroundColor: 'white',
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  fontWeight: '500' as const,
  color: '#6B5B4E',
  marginBottom: '6px',
};

const categories = ['ROPA', 'ACCESORIOS', 'EQUIPAMIENTO', 'NUTRICION', 'OTROS'];

export default function ProductManager({ products }: ProductManagerProps) {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newPrice, setNewPrice] = useState('');
  const [newStock, setNewStock] = useState('10');
  const [newImage, setNewImage] = useState('');
  const [newCategory, setNewCategory] = useState('OTROS');
  const [createError, setCreateError] = useState('');

  const [editName, setEditName] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editStock, setEditStock] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editCategory, setEditCategory] = useState('');
  const [editError, setEditError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('create');
    setCreateError('');
    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          description: newDescription,
          price: parseFloat(newPrice),
          stock: parseInt(newStock),
          image: newImage || null,
          category: newCategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error);
        return;
      }
      setShowCreateForm(false);
      setNewName('');
      setNewDescription('');
      setNewPrice('');
      setNewStock('10');
      setNewImage('');
      setNewCategory('OTROS');
      router.refresh();
    } catch {
      setCreateError('Error al crear el producto');
    } finally {
      setLoading(null);
    }
  };

  const handleEdit = async (productId: string) => {
    setLoading('edit');
    setEditError('');
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          description: editDescription,
          price: parseFloat(editPrice),
          stock: parseInt(editStock),
          image: editImage || null,
          category: editCategory,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setEditError(data.error);
        return;
      }
      setEditingId(null);
      router.refresh();
    } catch {
      setEditError('Error al editar el producto');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (productId: string) => {
    if (!confirm('¿Seguro que quieres eliminar este producto?')) return;
    setLoading(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error);
        return;
      }
      router.refresh();
    } catch {
      alert('Error al eliminar el producto');
    } finally {
      setLoading(null);
    }
  };

  const startEdit = (product: Product) => {
    setEditingId(product.id);
    setEditName(product.name);
    setEditDescription(product.description || '');
    setEditPrice(String(product.price));
    setEditStock(String(product.stock));
    setEditImage(product.image || '');
    setEditCategory(product.category);
    setEditError('');
  };

  return (
    <div>
      <style>{`
        .product-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .product-actions { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
        @media (max-width: 768px) {
          .product-row { flex-direction: column; align-items: flex-start; }
          .product-actions { width: 100%; justify-content: flex-end; }
        }
      `}</style>

      {/* Header */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '16px',
        }}
      >
        <h2 style={{ fontSize: '18px', fontWeight: '700', color: '#3D3530' }}>
          Gestionar Productos
        </h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            backgroundColor: showCreateForm ? '#F5F0E8' : '#7C6BC4',
            color: showCreateForm ? '#6B5B4E' : 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          {showCreateForm ? <X size={14} /> : <Plus size={14} />}
          {showCreateForm ? 'Cancelar' : 'Nuevo producto'}
        </button>
      </div>

      {/* Formulario crear */}
      {showCreateForm && (
        <div
          style={{
            backgroundColor: 'white',
            borderRadius: '20px',
            padding: '28px',
            border: '1px solid #EDE8E0',
            marginBottom: '16px',
          }}
        >
          <h3
            style={{
              fontSize: '15px',
              fontWeight: '700',
              color: '#3D3530',
              marginBottom: '20px',
            }}
          >
            Nuevo producto
          </h3>
          <form onSubmit={handleCreate}>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '14px',
                marginBottom: '14px',
              }}
            >
              <div>
                <label style={labelStyle}>Nombre</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Descripción</label>
                <textarea
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  rows={2}
                  style={{ ...inputStyle, resize: 'none' }}
                />
              </div>
              <div>
                <label style={labelStyle}>Precio (€)</label>
                <input
                  type="number"
                  step="0.01"
                  min="0"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Stock</label>
                <input
                  type="number"
                  min="0"
                  value={newStock}
                  onChange={(e) => setNewStock(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Categoría</label>
                <select
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                  style={inputStyle}
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>URL imagen (opcional)</label>
                <input
                  type="url"
                  value={newImage}
                  onChange={(e) => setNewImage(e.target.value)}
                  style={inputStyle}
                  placeholder="https://..."
                />
              </div>
            </div>
            {createError && (
              <div
                style={{
                  backgroundColor: '#FEF2F2',
                  borderRadius: '10px',
                  padding: '10px 14px',
                  marginBottom: '14px',
                }}
              >
                <p style={{ fontSize: '12px', color: '#DC2626' }}>
                  {createError}
                </p>
              </div>
            )}
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                type="submit"
                disabled={loading === 'create'}
                style={{
                  padding: '11px 24px',
                  backgroundColor: '#7C6BC4',
                  color: 'white',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  fontWeight: '600',
                  cursor: 'pointer',
                }}
              >
                {loading === 'create' ? 'Creando...' : 'Crear producto'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                style={{
                  padding: '11px 20px',
                  backgroundColor: '#F5F0E8',
                  color: '#6B5B4E',
                  border: 'none',
                  borderRadius: '10px',
                  fontSize: '13px',
                  cursor: 'pointer',
                }}
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista productos */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {products.length === 0 ? (
          <div
            style={{
              backgroundColor: 'white',
              borderRadius: '14px',
              padding: '32px',
              textAlign: 'center',
              border: '1px solid #EDE8E0',
            }}
          >
            <p style={{ fontSize: '13px', color: '#9E8E82' }}>
              No hay productos registrados
            </p>
          </div>
        ) : (
          products.map((product) => (
            <div
              key={product.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '14px',
                padding: '16px 20px',
                border: '1px solid #EDE8E0',
              }}
            >
              {editingId === product.id ? (
                <div>
                  <div
                    style={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px',
                      marginBottom: '12px',
                    }}
                  >
                    <div>
                      <label style={labelStyle}>Nombre</label>
                      <input
                        type="text"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Descripción</label>
                      <textarea
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                        rows={2}
                        style={{ ...inputStyle, resize: 'none' }}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Precio (€)</label>
                      <input
                        type="number"
                        step="0.01"
                        min="0"
                        value={editPrice}
                        onChange={(e) => setEditPrice(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Stock</label>
                      <input
                        type="number"
                        min="0"
                        value={editStock}
                        onChange={(e) => setEditStock(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Categoría</label>
                      <select
                        value={editCategory}
                        onChange={(e) => setEditCategory(e.target.value)}
                        style={inputStyle}
                      >
                        {categories.map((cat) => (
                          <option key={cat} value={cat}>
                            {cat}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>URL imagen</label>
                      <input
                        type="url"
                        value={editImage}
                        onChange={(e) => setEditImage(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                  </div>
                  {editError && (
                    <p
                      style={{
                        fontSize: '12px',
                        color: '#DC2626',
                        marginBottom: '10px',
                      }}
                    >
                      {editError}
                    </p>
                  )}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => handleEdit(product.id)}
                      disabled={loading === 'edit'}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '8px 16px',
                        backgroundColor: '#7C6BC4',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '600',
                        cursor: 'pointer',
                      }}
                    >
                      <Check size={12} />{' '}
                      {loading === 'edit' ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '8px 14px',
                        backgroundColor: '#F5F0E8',
                        color: '#6B5B4E',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      <X size={12} /> Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="product-row">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    {product.image ? (
                      <img
                        src={product.image}
                        alt={product.name}
                        style={{
                          width: '48px',
                          height: '48px',
                          borderRadius: '10px',
                          objectFit: 'cover',
                          flexShrink: 0,
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '48px',
                          height: '48px',
                          backgroundColor: '#EDE9F8',
                          borderRadius: '10px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '20px',
                          flexShrink: 0,
                        }}
                      >
                        🛍️
                      </div>
                    )}
                    <div>
                      <p
                        style={{
                          fontSize: '14px',
                          fontWeight: '600',
                          color: '#3D3530',
                          marginBottom: '2px',
                        }}
                      >
                        {product.name}
                      </p>
                      <p style={{ fontSize: '12px', color: '#9E8E82' }}>
                        {product.price.toFixed(2)}€ · {product.stock} en stock ·{' '}
                        {product.category}
                      </p>
                    </div>
                  </div>
                  <div className="product-actions">
                    <button
                      onClick={() => startEdit(product)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '7px 12px',
                        backgroundColor: '#F5F0E8',
                        color: '#6B5B4E',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      <Pencil size={11} /> Editar
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      disabled={loading === product.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        padding: '7px 12px',
                        backgroundColor: '#FEF2F2',
                        color: '#DC2626',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        fontWeight: '500',
                        cursor: 'pointer',
                      }}
                    >
                      <Trash2 size={11} /> Eliminar
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
