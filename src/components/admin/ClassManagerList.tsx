'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Pencil, Trash2, Plus, X } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

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

export default function ClassManagerList({
  classes,
  classTypes,
  instructors,
}: ClassManagerListProps) {
  const router = useRouter();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [loading, setLoading] = useState<string | null>(null);

  // Create form state
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newDate, setNewDate] = useState('');
  const [newStartHour, setNewStartHour] = useState('09:00');
  const [newDuration, setNewDuration] = useState('60');
  const [newCapacity, setNewCapacity] = useState('10');
  const [newClassTypeId, setNewClassTypeId] = useState(classTypes[0]?.id || '');
  const [newInstructorId, setNewInstructorId] = useState(
    instructors[0]?.id || ''
  );
  const [createError, setCreateError] = useState('');

  // Edit form state
  const [editTitle, setEditTitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editDate, setEditDate] = useState('');
  const [editStartHour, setEditStartHour] = useState('');
  const [editDuration, setEditDuration] = useState('60');
  const [editCapacity, setEditCapacity] = useState('');
  const [editClassTypeId, setEditClassTypeId] = useState('');
  const [editInstructorId, setEditInstructorId] = useState('');
  const [editError, setEditError] = useState('');

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading('create');
    setCreateError('');
    try {
      const startTime = new Date(`${newDate}T${newStartHour}:00`);
      const endTime = new Date(
        startTime.getTime() + parseInt(newDuration) * 60000
      );
      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newTitle,
          description: newDescription,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          capacity: newCapacity,
          classTypeId: newClassTypeId,
          instructorId: newInstructorId,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setCreateError(data.error);
        return;
      }
      setShowCreateForm(false);
      setNewTitle('');
      setNewDescription('');
      setNewDate('');
      router.refresh();
    } catch {
      setCreateError('Error al crear la clase');
    } finally {
      setLoading(null);
    }
  };

  const handleEdit = async (classId: string) => {
    setLoading('edit');
    setEditError('');
    try {
      const startTime = new Date(`${editDate}T${editStartHour}:00`);
      const endTime = new Date(
        startTime.getTime() + parseInt(editDuration) * 60000
      );
      const res = await fetch(`/api/classes/${classId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: editTitle,
          description: editDescription,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          capacity: editCapacity,
          classTypeId: editClassTypeId,
          instructorId: editInstructorId,
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
      setEditError('Error al editar la clase');
    } finally {
      setLoading(null);
    }
  };

  const handleCancel = async (classId: string) => {
    if (!confirm('¿Seguro que quieres cancelar esta clase?')) return;
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

  const startEdit = (yogaClass: YogaClass) => {
    setEditingId(yogaClass.id);
    setEditTitle(yogaClass.title);
    setEditDescription(yogaClass.description || '');
    setEditDate(format(new Date(yogaClass.startTime), 'yyyy-MM-dd'));
    setEditStartHour(format(new Date(yogaClass.startTime), 'HH:mm'));
    setEditDuration(
      String(
        (new Date(yogaClass.endTime).getTime() -
          new Date(yogaClass.startTime).getTime()) /
          60000
      )
    );
    setEditCapacity(String(yogaClass.capacity));
    setEditClassTypeId(yogaClass.classTypeId);
    setEditInstructorId(yogaClass.instructorId);
    setEditError('');
  };

  return (
    <div>
      <style>{`
        .class-row { display: flex; align-items: center; justify-content: space-between; }
        .class-actions { display: flex; align-items: center; gap: 8px; }
        @media (max-width: 768px) {
          .class-row { flex-direction: column; align-items: flex-start; gap: 12px; }
          .class-actions { width: 100%; justify-content: flex-end; }
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
          Gestionar clases próximas
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
          {showCreateForm ? 'Cancelar' : 'Nueva clase'}
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
            Nueva clase
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
                <label style={labelStyle}>Título de la clase</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  style={inputStyle}
                  placeholder="Ej: Hatha Yoga Mañana"
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Tipo de clase</label>
                <select
                  value={newClassTypeId}
                  onChange={(e) => setNewClassTypeId(e.target.value)}
                  style={inputStyle}
                  required
                >
                  {classTypes.map((ct) => (
                    <option key={ct.id} value={ct.id}>
                      {ct.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Instructor</label>
                <select
                  value={newInstructorId}
                  onChange={(e) => setNewInstructorId(e.target.value)}
                  style={inputStyle}
                  required
                >
                  {instructors.map((inst) => (
                    <option key={inst.id} value={inst.id}>
                      {inst.user.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Fecha</label>
                <input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Hora de inicio</label>
                <input
                  type="time"
                  value={newStartHour}
                  onChange={(e) => setNewStartHour(e.target.value)}
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Duración</label>
                <select
                  value={newDuration}
                  onChange={(e) => setNewDuration(e.target.value)}
                  style={inputStyle}
                >
                  <option value="45">45 min</option>
                  <option value="60">60 min</option>
                  <option value="75">75 min</option>
                  <option value="90">90 min</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Capacidad máxima</label>
                <input
                  type="number"
                  value={newCapacity}
                  onChange={(e) => setNewCapacity(e.target.value)}
                  min="1"
                  max="50"
                  style={inputStyle}
                  required
                />
              </div>
              <div>
                <label style={labelStyle}>Descripción (opcional)</label>
                <input
                  type="text"
                  value={newDescription}
                  onChange={(e) => setNewDescription(e.target.value)}
                  style={inputStyle}
                  placeholder="Descripción breve"
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
                {loading === 'create' ? 'Creando...' : 'Crear clase'}
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

      {/* Lista clases */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {classes.length === 0 ? (
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
              style={{
                fontSize: '28px',
                display: 'block',
                marginBottom: '8px',
              }}
            >
              🗓️
            </span>
            <p style={{ fontSize: '13px', color: '#9E8E82' }}>
              No hay clases programadas próximamente
            </p>
          </div>
        ) : (
          classes.map((yogaClass) => (
            <div
              key={yogaClass.id}
              style={{
                backgroundColor: 'white',
                borderRadius: '14px',
                padding: '16px 20px',
                border: '1px solid #EDE8E0',
                opacity: yogaClass.status === 'CANCELLED' ? 0.5 : 1,
              }}
            >
              {editingId === yogaClass.id ? (
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
                      <label style={labelStyle}>Título</label>
                      <input
                        type="text"
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Tipo de clase</label>
                      <select
                        value={editClassTypeId}
                        onChange={(e) => setEditClassTypeId(e.target.value)}
                        style={inputStyle}
                      >
                        {classTypes.map((ct) => (
                          <option key={ct.id} value={ct.id}>
                            {ct.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Instructor</label>
                      <select
                        value={editInstructorId}
                        onChange={(e) => setEditInstructorId(e.target.value)}
                        style={inputStyle}
                      >
                        {instructors.map((inst) => (
                          <option key={inst.id} value={inst.id}>
                            {inst.user.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Fecha</label>
                      <input
                        type="date"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Hora</label>
                      <input
                        type="time"
                        value={editStartHour}
                        onChange={(e) => setEditStartHour(e.target.value)}
                        style={inputStyle}
                        required
                      />
                    </div>
                    <div>
                      <label style={labelStyle}>Duración</label>
                      <select
                        value={editDuration}
                        onChange={(e) => setEditDuration(e.target.value)}
                        style={inputStyle}
                      >
                        <option value="45">45 min</option>
                        <option value="60">60 min</option>
                        <option value="75">75 min</option>
                        <option value="90">90 min</option>
                      </select>
                    </div>
                    <div>
                      <label style={labelStyle}>Capacidad</label>
                      <input
                        type="number"
                        value={editCapacity}
                        onChange={(e) => setEditCapacity(e.target.value)}
                        style={inputStyle}
                        required
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
                      onClick={() => handleEdit(yogaClass.id)}
                      disabled={loading === 'edit'}
                      style={{
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
                      {loading === 'edit' ? 'Guardando...' : 'Guardar'}
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      style={{
                        padding: '8px 14px',
                        backgroundColor: '#F5F0E8',
                        color: '#6B5B4E',
                        border: 'none',
                        borderRadius: '8px',
                        fontSize: '12px',
                        cursor: 'pointer',
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <div className="class-row">
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                    }}
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
                        )}{' '}
                        · {yogaClass.instructor.user.name} ·{' '}
                        {yogaClass.bookings.length}/{yogaClass.capacity} plazas
                      </p>
                    </div>
                  </div>
                  <div className="class-actions">
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
                          onClick={() => startEdit(yogaClass)}
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
                          <Pencil size={12} /> Editar
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
                          <Trash2 size={12} /> Cancelar
                        </button>
                      </>
                    )}
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
