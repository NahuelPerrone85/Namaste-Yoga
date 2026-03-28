'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, X, Check } from 'lucide-react';

interface EditProfileFormProps {
  user: {
    name: string | null;
    email: string | null;
    bio: string | null;
    image: string | null;
  };
}

export default function EditProfileForm({ user }: EditProfileFormProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [image, setImage] = useState(user.image || '');

  const handleSubmit = async () => {
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, bio, image }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      setIsEditing(false);
      router.refresh();
    } catch {
      setError('Error al guardar los cambios');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setName(user.name || '');
    setBio(user.bio || '');
    setImage(user.image || '');
    setError('');
    setIsEditing(false);
  };

  if (!isEditing) {
    return (
      <button
        onClick={() => setIsEditing(true)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          padding: '12px',
          backgroundColor: 'white',
          border: '1px solid #EDE8E0',
          borderRadius: '14px',
          fontSize: '13px',
          fontWeight: '500',
          color: '#6B5B4E',
          cursor: 'pointer',
        }}
      >
        <Pencil size={14} />
        Editar perfil
      </button>
    );
  }

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '24px',
        border: '1px solid #EDE8E0',
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
        <p style={{ fontSize: '14px', fontWeight: '600', color: '#3D3530' }}>
          Editar perfil
        </p>
        <button
          onClick={handleCancel}
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
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
            Nombre
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid #EDE8E0',
              fontSize: '13px',
              color: '#3D3530',
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>

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
            Descripción
          </label>
          <textarea
            value={bio}
            onChange={(e) => setBio(e.target.value)}
            rows={3}
            maxLength={500}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid #EDE8E0',
              fontSize: '13px',
              color: '#3D3530',
              outline: 'none',
              resize: 'none',
              boxSizing: 'border-box',
            }}
            placeholder="Cuéntanos algo sobre ti..."
          />
          <p
            style={{
              fontSize: '11px',
              color: '#C4B8B0',
              marginTop: '4px',
              textAlign: 'right',
            }}
          >
            {bio.length}/500
          </p>
        </div>

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
            URL foto de perfil
          </label>
          <input
            type="url"
            value={image}
            onChange={(e) => setImage(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 14px',
              borderRadius: '10px',
              border: '1px solid #EDE8E0',
              fontSize: '13px',
              color: '#3D3530',
              outline: 'none',
              boxSizing: 'border-box',
            }}
            placeholder="https://..."
          />
          {image && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                marginTop: '8px',
              }}
            >
              <img
                src={image}
                alt="Preview"
                style={{
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                }}
                onError={(e) => {
                  (e.target as HTMLImageElement).style.display = 'none';
                }}
              />
              <span style={{ fontSize: '11px', color: '#9E8E82' }}>
                Preview
              </span>
            </div>
          )}
        </div>

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

        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            onClick={handleSubmit}
            disabled={loading}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '11px',
              backgroundColor: '#7C6BC4',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <Check size={14} />
            {loading ? 'Guardando...' : 'Guardar'}
          </button>
          <button
            onClick={handleCancel}
            style={{
              padding: '11px 16px',
              backgroundColor: '#F5F0E8',
              color: '#6B5B4E',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '500',
              cursor: 'pointer',
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
