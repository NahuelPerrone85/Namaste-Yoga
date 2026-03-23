import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import ClassCard from '@/components/booking/ClassCard';

const mockClass = {
  id: 'class-1',
  title: 'Hatha Yoga Mañana',
  startTime: new Date(Date.now() + 3600000 * 24).toISOString(),
  endTime: new Date(Date.now() + 3600000 * 25).toISOString(),
  capacity: 10,
  classType: { name: 'Hatha Yoga', color: '#6366f1' },
  instructor: { user: { name: 'Ana García' } },
  bookings: [],
};

describe('ClassCard', () => {
  it('muestra el título de la clase', () => {
    render(
      <ClassCard yogaClass={mockClass} onBook={vi.fn()} onCancel={vi.fn()} />
    );
    expect(screen.getByText('Hatha Yoga Mañana')).toBeInTheDocument();
  });

  it('muestra el nombre del instructor', () => {
    render(
      <ClassCard yogaClass={mockClass} onBook={vi.fn()} onCancel={vi.fn()} />
    );
    expect(screen.getByText('Ana García')).toBeInTheDocument();
  });

  it('muestra las plazas disponibles', () => {
    render(
      <ClassCard yogaClass={mockClass} onBook={vi.fn()} onCancel={vi.fn()} />
    );
    expect(screen.getByText('10 plazas disponibles')).toBeInTheDocument();
  });

  it('muestra clase llena cuando no hay plazas', () => {
    const fullClass = {
      ...mockClass,
      bookings: Array(10).fill({ id: 'b-1', userId: 'user-1' }),
    };
    render(
      <ClassCard yogaClass={fullClass} onBook={vi.fn()} onCancel={vi.fn()} />
    );
    expect(screen.getByText('Clase llena')).toBeInTheDocument();
  });

  it('llama a onBook al hacer click en Reservar', async () => {
    const onBook = vi.fn();
    render(
      <ClassCard yogaClass={mockClass} onBook={onBook} onCancel={vi.fn()} />
    );
    await userEvent.click(screen.getByText('Reservar'));
    expect(onBook).toHaveBeenCalledWith('class-1');
  });

  it('muestra badge Reservado si el usuario tiene reserva', () => {
    const bookedClass = {
      ...mockClass,
      bookings: [{ id: 'booking-1', userId: 'current-user' }],
    };
    render(
      <ClassCard
        yogaClass={bookedClass}
        currentUserId="current-user"
        onBook={vi.fn()}
        onCancel={vi.fn()}
      />
    );
    expect(screen.getByText('✓ Reservado')).toBeInTheDocument();
  });
});
