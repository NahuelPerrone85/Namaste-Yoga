'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
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

export default function CoachManager({ instructors }: CoachManagerProps) {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  // Create form state
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [newBio, setNewBio] = useState('');
  const [newSpecialty, setNewSpecialty] = useState('');
  const [createError, setCreateError] = useState('');

  // Edit form state
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
    if (
      !confirm(
        'Seguro que quieres eliminar este coach? Esta accion no se puede deshacer.'
      )
    )
      return;

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
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold text-gray-900">Gestionar Coaches</h2>
        <Button
          onClick={() => setShowCreateForm(!showCreateForm)}
          className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700"
        >
          <Plus className="h-4 w-4" />
          Nuevo coach
        </Button>
      </div>

      {/* Formulario crear coach */}
      {showCreateForm && (
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Nuevo coach</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowCreateForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Nombre completo
                  </label>
                  <input
                    type="text"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    value={newEmail}
                    onChange={(e) => setNewEmail(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Contrasena temporal
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    required
                    minLength={6}
                  />
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Especialidades (separadas por coma)
                  </label>
                  <input
                    type="text"
                    value={newSpecialty}
                    onChange={(e) => setNewSpecialty(e.target.value)}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="Hatha Yoga, Meditacion, Vinyasa"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="mb-1 block text-sm font-medium text-gray-700">
                    Bio
                  </label>
                  <textarea
                    value={newBio}
                    onChange={(e) => setNewBio(e.target.value)}
                    rows={3}
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                    placeholder="Descripcion del coach..."
                  />
                </div>
              </div>
              {createError && (
                <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
                  {createError}
                </div>
              )}
              <div className="flex gap-3">
                <Button
                  type="submit"
                  disabled={loading === 'create'}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  {loading === 'create' ? 'Creando...' : 'Crear coach'}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowCreateForm(false)}
                >
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Lista de coaches */}
      <div className="space-y-3">
        {instructors.length === 0 ? (
          <Card>
            <CardContent className="p-6 text-center text-gray-400">
              No hay coaches registrados
            </CardContent>
          </Card>
        ) : (
          instructors.map((instructor) => (
            <Card key={instructor.id}>
              <CardContent className="p-4">
                {editingId === instructor.id ? (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Nombre
                        </label>
                        <input
                          type="text"
                          value={editName}
                          onChange={(e) => setEditName(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Especialidades (separadas por coma)
                        </label>
                        <input
                          type="text"
                          value={editSpecialty}
                          onChange={(e) => setEditSpecialty(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          URL foto
                        </label>
                        <input
                          type="url"
                          value={editImage}
                          onChange={(e) => setEditImage(e.target.value)}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                      <div>
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                          Bio
                        </label>
                        <textarea
                          value={editBio}
                          onChange={(e) => setEditBio(e.target.value)}
                          rows={2}
                          className="w-full rounded-lg border border-gray-300 px-4 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
                        />
                      </div>
                    </div>
                    {editError && (
                      <div className="rounded-lg bg-red-50 p-3 text-sm text-red-500">
                        {editError}
                      </div>
                    )}
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => handleEdit(instructor.id)}
                        disabled={loading === 'edit'}
                        className="bg-purple-600 hover:bg-purple-700"
                      >
                        <Check className="mr-1 h-3 w-3" />
                        {loading === 'edit' ? 'Guardando...' : 'Guardar'}
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setEditingId(null)}
                      >
                        <X className="mr-1 h-3 w-3" />
                        Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      {instructor.user.image ? (
                        <img
                          src={instructor.user.image}
                          alt={instructor.user.name || ''}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 text-lg font-bold text-purple-600">
                          {instructor.user.name?.charAt(0).toUpperCase()}
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900">
                          {instructor.user.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          {instructor.user.email}
                        </p>
                        <div className="mt-1 flex flex-wrap gap-1">
                          {instructor.specialty.map((spec) => (
                            <Badge
                              key={spec}
                              variant="secondary"
                              className="bg-purple-100 text-xs text-purple-700"
                            >
                              {spec}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-400">
                        {instructor.classes.length} clases
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => startEdit(instructor)}
                        className="flex items-center gap-1"
                      >
                        <Pencil className="h-3 w-3" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDelete(instructor.id)}
                        disabled={loading === instructor.id}
                        className="flex items-center gap-1 border-red-200 text-red-500 hover:bg-red-50"
                      >
                        <Trash2 className="h-3 w-3" />
                        Eliminar
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
