'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import EditClassForm from './EditClassForm';

interface ClassType {
  id: string;
  name: string;
  color: string;
}

interface Instructor {
  id: string;
  user: { name: string | null };
}

interface YogaClass {
  id: string;
  title: string;
  description: string | null;
  startTime: Date;
  endTime: Date;
  capacity: number;
  classTypeId: string;
  instructorId: string;
  status: string;
  classType: ClassType;
  instructor: { user: { name: string | null } };
  bookings: { id: string }[];
}

interface ClassManagerListProps {
  classes: YogaClass[];
  classTypes: ClassType[];
  instructors: Instructor[];
}

export default function ClassManagerList({
  classes,
  classTypes,
  instructors,
}: ClassManagerListProps) {
  const router = useRouter();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  const handleCancel = async (classId: string) => {
    if (
      !confirm(
        '¿Seguro que quieres cancelar esta clase? Se cancelaran todas las reservas.'
      )
    )
      return;

    setLoading(classId);
    try {
      const res = await fetch(`/api/classes/${classId}`, {
        method: 'DELETE',
      });

      if (!res.ok) {
        const data = await res.json();
        alert(data.error);
        return;
      }

      router.refresh();
    } catch {
      alert('Error al cancelar la clase');
    } finally {
      setLoading(null);
    }
  };

  if (classes.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center text-gray-400">
          No hay clases programadas
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-3">
      {classes.map((yogaClass) => (
        <div key={yogaClass.id}>
          {editingId === yogaClass.id ? (
            <EditClassForm
              yogaClass={yogaClass}
              classTypes={classTypes}
              instructors={instructors}
              onClose={() => setEditingId(null)}
            />
          ) : (
            <Card
              className={yogaClass.status === 'CANCELLED' ? 'opacity-50' : ''}
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-gray-900">
                        {yogaClass.title}
                      </h3>
                      {yogaClass.status === 'CANCELLED' && (
                        <Badge
                          variant="secondary"
                          className="bg-red-100 text-red-600"
                        >
                          Cancelada
                        </Badge>
                      )}
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      {format(
                        new Date(yogaClass.startTime),
                        'EEEE d MMM · HH:mm',
                        { locale: es }
                      )}
                      {' · '}
                      {yogaClass.instructor.user.name}
                    </p>
                    <p className="text-sm text-gray-400">
                      {yogaClass.bookings.length}/{yogaClass.capacity} plazas
                      ocupadas
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      style={{
                        backgroundColor: yogaClass.classType.color + '20',
                        color: yogaClass.classType.color,
                      }}
                    >
                      {yogaClass.classType.name}
                    </Badge>
                    {yogaClass.status !== 'CANCELLED' && (
                      <>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditingId(yogaClass.id)}
                          className="flex items-center gap-1"
                        >
                          <Pencil className="h-3 w-3" />
                          Editar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleCancel(yogaClass.id)}
                          disabled={loading === yogaClass.id}
                          className="flex items-center gap-1 border-red-200 text-red-500 hover:bg-red-50"
                        >
                          <Trash2 className="h-3 w-3" />
                          Cancelar
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      ))}
    </div>
  );
}
