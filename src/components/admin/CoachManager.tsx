'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Plus, Pencil, Trash2, X, Check } from 'lucide-react';

interface Instructor {
  id: string;
  specialty: string[];
  user: {
    id: string;
    name: string | null;
    email: string | null;
    image: string | null;
    bio: string | null;
  };
  classes: { id: string }[];
}

interface CoachManagerProps {
  instructors: Instructor[];
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

export default function CoachManager({ instructors }: CoachManagerProps) {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [createError, setCreateError] = useState('');

  const [editName, setEditName] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editSpecialty, setEditSpecialty] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editError, setEditError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('create');
    setCreateError('');
    try {
      const res = await fetch('/api/instructors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newName,
          email: newEmail,
          password: newPassword,
          bio: newBio,
          specialty: newSpecialty
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error);
        return;
      }
      setShowCreateForm(false);
      setNewName('');
      setNewEmail('');
      setNewPassword('');
      setNewBio('');
      setNewSpecialty('');
      router.refresh();
    } catch {
      setCreateError('Error al crear el coach');
    } finally {
      setLoading(null);
    }
  };

  const handleEdit = async (instructorId: string) => {
    setLoading('edit');
    setEditError('');
    try {
      const res = await fetch(`/api/instructors/${instructorId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editName,
          bio: editBio,
          specialty: editSpecialty
            .split(',')
            .map((s) => s.trim())
            .filter(Boolean),
          image: editImage,
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
      setEditError('Error al editar el coach');
    } finally {
      setLoading(null);
    }
  };

  const handleDelete = async (instructorId: string) => {
    if (!confirm('¿Seguro que quieres eliminar este coach?')) return;
    setLoading(instructorId);
    try {
      const res = await fetch(`/api/instructors/${instructorId}`, {
        method: 'DELETE',
      });
      const data = await res.json();
      if (!res.ok) {
        alert(data.error);
        return;
      }
      router.refresh();
    } catch {
      alert('Error al eliminar el coach');
    } finally {
      setLoading(null);
    }
  };

  const startEdit = (instructor: Instructor) => {
    setEditingId(instructor.id);
    setEditName(instructor.user.name || '');
    setEditBio(instructor.user.bio || '');
    setEditSpecialty(instructor.specialty.join(', '));
    setEditImage(instructor.user.image || '');
    setEditError('');
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
          Gestionar Coaches
        </h2>
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            padding: '10px 18px',
            backgroundColor: '#7C6BC4',
            color: 'white',
            border: 'none',
            borderRadius: '10px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
          }}
        >
          <Plus size={14} />
          Nuevo coach
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
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginBottom: '20px',
            }}
          >
            <h3
              style={{ fontSize: '15px', fontWeight: '700', color: '#3D3530' }}
            >
              Nuevo coach
            </h3>
            <button
              onClick={() => setShowCreateForm(false)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: '#9E8E82',
              }}
            >
              <X size={16} />
            </button>
          </div>
          <form onSubmit={handleCreate}>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '14px',
                marginBottom: '14px',
              }}
            >
              <div>
                <label style={labelStyle}>Nombre completo</label>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input
                  type="email"
                  value={newEmail}
                  onChange={(e) => setNewEmail(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Contraseña temporal</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  style={inputStyle}
                  required
                  minLength={6}
                />
              </div>
              <div>
                <label style={labelStyle}>
                  Especialidades (separadas por coma)
                </label>
                <input
                  type="text"
                  value={newSpecialty}
                  onChange={(e) => setNewSpecialty(e.target.value)}
                  style={inputStyle}
                  placeholder="Hatha Yoga, Meditación"
                />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <label style={labelStyle}>Bio</label>
                <textarea
                  value={newBio}
                  onChange={(e) => setNewBio(e.target.value)}
                  rows={2}
                  style={{ ...inputStyle, resize: 'none' }}
                  placeholder="Descripción del coach..."
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
                {loading === 'create' ? 'Creando...' : 'Crear coach'}
              </button>
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                style={{
                  padding: '10px 16px',
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

      {/* Lista coaches */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {instructors.length === 0 ? (
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
              No hay coaches registrados
            </p>
          </div>
        ) : (
          instructors.map((instructor) => (
            <div
              key={instructor.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '14px',
                padding: '16px 20px',
                border: '1px solid #EDE8E0',
              }}
            >
              {editingId === instructor.id ? (
                <div>
                  <div
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
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
                      <label style={labelStyle}>Especialidades (coma)</label>
                      <input
                        type="text"
                        value={editSpecialty}
                        onChange={(e) => setEditSpecialty(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>URL foto</label>
                      <input
                        type="url"
                        value={editImage}
                        onChange={(e) => setEditImage(e.target.value)}
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Bio</label>
                      <input
                        type="text"
                        value={editBio}
                        onChange={(e) => setEditBio(e.target.value)}
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
                      onClick={() => handleEdit(instructor.id)}
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
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '12px',
                    }}
                  >
                    {instructor.user.image ? (
                      <img
                        src={instructor.user.image}
                        alt={instructor.user.name || ''}
                        style={{
                          width: '40px',
                          height: '40px',
                          borderRadius: '50%',
                          objectFit: 'cover',
                        }}
                      />
                    ) : (
                      <div
                        style={{
                          width: '40px',
                          height: '40px',
                          backgroundColor: '#EDE9F8',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '16px',
                          fontWeight: '700',
                          color: '#7C6BC4',
                        }}
                      >
                        {instructor.user.name?.charAt(0).toUpperCase()}
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
                        {instructor.user.name}
                      </p>
                      <p
                        style={{
                          fontSize: '12px',
                          color: '#9E8E82',
                          marginBottom: '4px',
                        }}
                      >
                        {instructor.user.email}
                      </p>
                      <div
                        style={{
                          display: 'flex',
                          flexWrap: 'wrap',
                          gap: '4px',
                        }}
                      >
                        {instructor.specialty.map((spec) => (
                          <span
                            key={spec}
                            style={{
                              fontSize: '10px',
                              fontWeight: '500',
                              color: '#7C6BC4',
                              backgroundColor: '#EDE9F8',
                              padding: '2px 8px',
                              borderRadius: '20px',
                            }}
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <span style={{ fontSize: '12px', color: '#9E8E82' }}>
                      {instructor.classes.length} clases
                    </span>
                    <button
                      onClick={() => startEdit(instructor)}
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
                      onClick={() => handleDelete(instructor.id)}
                      disabled={loading === instructor.id}
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
