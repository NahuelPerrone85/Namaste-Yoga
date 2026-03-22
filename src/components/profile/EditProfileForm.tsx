'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsEditing(true)}
        className="flex items-center gap-2"
      >
        <Pencil className="h-4 w-4" />
        Editar perfil
      </Button>
    );
  }

  return (
    <Card className="mt-4">
      <CardContent className="p-6">
        <h3 className="mb-4 font-semibold text-gray-900">Editar perfil</h3>

        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Nombre completo
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Tu nombre"
            />
          </div>

          {/* Bio */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              Descripcion personal
            </label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={500}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="Cuentanos algo sobre ti... (opcional)"
            />
            <p className="mt-1 text-xs text-gray-400">
              {bio.length}/500 caracteres
            </p>
          </div>

          {/* Foto de perfil */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">
              URL de foto de perfil
            </label>
            <input
              type="url"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="https://ejemplo.com/tu-foto.jpg"
            />
            {image && (
              <div className="mt-2 flex items-center gap-3">
                <img
                  src={image}
                  alt="Preview"
                  className="h-12 w-12 rounded-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
                <p className="text-xs text-gray-400">Preview de tu foto</p>
              </div>
            )}
          </div>

          {error && (
            <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
              {error}
            </div>
          )}

          <div className="flex gap-3">
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
            >
              <Check className="h-4 w-4" />
              {loading ? 'Guardando...' : 'Guardar cambios'}
            </Button>
            <Button
              variant="outline"
              onClick={handleCancel}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Cancelar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
