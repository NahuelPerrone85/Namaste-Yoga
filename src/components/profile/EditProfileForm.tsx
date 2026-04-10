'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, X, Check, Camera, Loader } from 'lucide-react';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState(user.name || '');
  const [bio, setBio] = useState(user.bio || '');
  const [image, setImage] = useState(user.image || '');
  const [imagePreview, setImagePreview] = useState(user.image || '');

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Preview inmediato
    const reader = new FileReader();
    reader.onload = (e) => {
      setImagePreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);

    // Subir a Cloudinary
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setImagePreview(user.image || '');
        return;
      }

      setImage(data.url);
    } catch {
      setError('Error al subir la imagen');
      setImagePreview(user.image || '');
    } finally {
      setUploadingImage(false);
    }
  };

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
    setImagePreview(user.image || '');
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {/* Foto de perfil */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <div
            onClick={handleImageClick}
            style={{
              position: 'relative',
              width: '80px',
              height: '80px',
              cursor: 'pointer',
            }}
          >
            {imagePreview ? (
              <img
                src={imagePreview}
                alt="Foto de perfil"
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  border: '3px solid #EDE9F8',
                }}
              />
            ) : (
              <div
                style={{
                  width: '80px',
                  height: '80px',
                  backgroundColor: '#EDE9F8',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '28px',
                  fontWeight: '700',
                  color: '#7C6BC4',
                }}
              >
                {name?.charAt(0).toUpperCase()}
              </div>
            )}

            {/* Overlay */}
            <div
              style={{
                position: 'absolute',
                bottom: 0,
                right: 0,
                width: '28px',
                height: '28px',
                backgroundColor: uploadingImage ? '#EDE9F8' : '#7C6BC4',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid white',
              }}
            >
              {uploadingImage ? (
                <Loader
                  size={12}
                  color="#7C6BC4"
                  style={{ animation: 'spin 1s linear infinite' }}
                />
              ) : (
                <Camera size={12} color="white" />
              )}
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            style={{ display: 'none' }}
          />

          <p style={{ fontSize: '11px', color: '#9E8E82' }}>
            {uploadingImage
              ? 'Subiendo imagen...'
              : 'Toca para cambiar la foto'}
          </p>
        </div>

        {/* Nombre */}
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

        {/* Bio */}
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
            disabled={loading || uploadingImage}
            style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              padding: '11px',
              backgroundColor:
                loading || uploadingImage ? '#A598D4' : '#7C6BC4',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: loading || uploadingImage ? 'not-allowed' : 'pointer',
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
