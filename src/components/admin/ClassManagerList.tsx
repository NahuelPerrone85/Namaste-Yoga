'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
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
        '¿Seguro que quieres cancelar esta clase? Se cancelarán todas las reservas.'
      )
    )
      return;
    setLoading(classId);
    try {
      const res = await fetch(`/api/classes/${classId}`, { method: 'DELETE' });
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
      <div
        style={{
          backgroundColor: 'white',
          borderRadius: '16px',
          padding: '32px',
          textAlign: 'center',
          border: '1px solid #EDE8E0',
        }}
      >
        <span
          style={{ fontSize: '28px', display: 'block', marginBottom: '8px' }}
        >
          🗓️
        </span>
        <p style={{ fontSize: '13px', color: '#9E8E82' }}>
          No hay clases programadas próximamente
        </p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
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
            <div
              style={{
                backgroundColor: 'white',
                borderRadius: '14px',
                padding: '16px 20px',
                border: '1px solid #EDE8E0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                opacity: yogaClass.status === 'CANCELLED' ? 0.5 : 1,
              }}
            >
              <div
                style={{ display: 'flex', alignItems: 'center', gap: '14px' }}
              >
                <div
                  style={{
                    width: '44px',
                    height: '44px',
                    backgroundColor: yogaClass.classType.color + '20',
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '20px',
                    flexShrink: 0,
                  }}
                >
                  {yogaClass.classType.name.includes('Hatha')
                    ? '🧘'
                    : yogaClass.classType.name.includes('Vinyasa')
                      ? '🌊'
                      : '🌙'}
                </div>
                <div>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      marginBottom: '2px',
                    }}
                  >
                    <p
                      style={{
                        fontSize: '14px',
                        fontWeight: '600',
                        color: '#3D3530',
                      }}
                    >
                      {yogaClass.title}
                    </p>
                    {yogaClass.status === 'CANCELLED' && (
                      <span
                        style={{
                          fontSize: '10px',
                          fontWeight: '600',
                          color: '#DC2626',
                          backgroundColor: '#FEF2F2',
                          padding: '2px 8px',
                          borderRadius: '20px',
                        }}
                      >
                        Cancelada
                      </span>
                    )}
                  </div>
                  <p style={{ fontSize: '12px', color: '#9E8E82' }}>
                    {format(
                      new Date(yogaClass.startTime),
                      'EEEE d MMM · HH:mm',
                      { locale: es }
                    )}
                    {' · '}
                    {yogaClass.instructor.user.name}
                    {' · '}
                    {yogaClass.bookings.length}/{yogaClass.capacity} plazas
                  </p>
                </div>
              </div>

              <div
                style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
              >
                <span
                  style={{
                    fontSize: '11px',
                    fontWeight: '500',
                    color: yogaClass.classType.color,
                    backgroundColor: yogaClass.classType.color + '20',
                    padding: '3px 10px',
                    borderRadius: '20px',
                  }}
                >
                  {yogaClass.classType.name}
                </span>
                {yogaClass.status !== 'CANCELLED' && (
                  <>
                    <button
                      onClick={() => setEditingId(yogaClass.id)}
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
                      <Pencil size={12} />
                      Editar
                    </button>
                    <button
                      onClick={() => handleCancel(yogaClass.id)}
                      disabled={loading === yogaClass.id}
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
                      <Trash2 size={12} />
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
