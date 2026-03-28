'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { X } from 'lucide-react';

interface ClassType {
  id: string;
  name: string;
  color: string;
}

interface Instructor {
  id: string;
  user: { name: string | null };
}

interface CreateClassFormProps {
  classTypes: ClassType[];
  instructors: Instructor[];
  onClose: () => void;
}

export default function CreateClassForm({
  classTypes,
  instructors,
  onClose,
}: CreateClassFormProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [startHour, setStartHour] = useState('09:00');
  const [duration, setDuration] = useState('60');
  const [capacity, setCapacity] = useState('10');
  const [classTypeId, setClassTypeId] = useState(classTypes[0]?.id || '');
  const [instructorId, setInstructorId] = useState(instructors[0]?.id || '');

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const startTime = new Date(`${date}T${startHour}:00`);
      const endTime = new Date(
        startTime.getTime() + parseInt(duration) * 60000
      );

      const res = await fetch('/api/classes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          capacity,
          classTypeId,
          instructorId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error);
        setLoading(false);
        return;
      }

      router.refresh();
      onClose();
    } catch {
      setError('Error al crear la clase');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        backgroundColor: 'white',
        borderRadius: '20px',
        padding: '28px',
        border: '1px solid #EDE8E0',
        marginBottom: '24px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '24px',
        }}
      >
        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#3D3530' }}>
          Nueva clase
        </h3>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: '#9E8E82',
          }}
        >
          <X size={18} />
        </button>
      </div>

      <form onSubmit={handleSubmit}>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            marginBottom: '16px',
          }}
        >
          <div>
            <label style={labelStyle}>Título de la clase</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              style={inputStyle}
              placeholder="Ej: Hatha Yoga Mañana"
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Tipo de clase</label>
            <select
              value={classTypeId}
              onChange={(e) => setClassTypeId(e.target.value)}
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
              value={instructorId}
              onChange={(e) => setInstructorId(e.target.value)}
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
              value={date}
              onChange={(e) => setDate(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Hora de inicio</label>
            <input
              type="time"
              value={startHour}
              onChange={(e) => setStartHour(e.target.value)}
              style={inputStyle}
              required
            />
          </div>
          <div>
            <label style={labelStyle}>Duración</label>
            <select
              value={duration}
              onChange={(e) => setDuration(e.target.value)}
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
              value={capacity}
              onChange={(e) => setCapacity(e.target.value)}
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
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              style={inputStyle}
              placeholder="Descripción breve"
            />
          </div>
        </div>

        {error && (
          <div
            style={{
              backgroundColor: '#FEF2F2',
              borderRadius: '10px',
              padding: '10px 14px',
              marginBottom: '16px',
            }}
          >
            <p style={{ fontSize: '13px', color: '#DC2626' }}>{error}</p>
          </div>
        )}

        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '11px 24px',
              backgroundColor: '#7C6BC4',
              color: 'white',
              border: 'none',
              borderRadius: '10px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            {loading ? 'Creando...' : 'Crear clase'}
          </button>
          <button
            type="button"
            onClick={onClose}
            style={{
              padding: '11px 20px',
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
      </form>
    </div>
  );
}
