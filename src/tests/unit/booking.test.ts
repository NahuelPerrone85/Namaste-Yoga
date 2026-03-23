import { describe, it, expect } from 'vitest';

// Lógica de negocio — estas funciones las extraemos para poder testearlas
function canCancelBooking(classStartTime: Date): boolean {
  const twoHoursBefore = new Date(classStartTime);
  twoHoursBefore.setHours(twoHoursBefore.getHours() - 2);
  return new Date() < twoHoursBefore;
}

function getSpotsLeft(capacity: number, confirmedBookings: number): number {
  return capacity - confirmedBookings;
}

function isClassFull(capacity: number, confirmedBookings: number): boolean {
  return confirmedBookings >= capacity;
}

function getSpotStatus(
  capacity: number,
  confirmedBookings: number
): 'available' | 'limited' | 'full' {
  const spotsLeft = getSpotsLeft(capacity, confirmedBookings);
  if (spotsLeft === 0) return 'full';
  if (spotsLeft <= 3) return 'limited';
  return 'available';
}

// Tests
describe('Booking — política de cancelación', () => {
  it('permite cancelar si faltan más de 2 horas', () => {
    const futureClass = new Date();
    futureClass.setHours(futureClass.getHours() + 3);
    expect(canCancelBooking(futureClass)).toBe(true);
  });

  it('no permite cancelar si faltan menos de 2 horas', () => {
    const soonClass = new Date();
    soonClass.setHours(soonClass.getHours() + 1);
    expect(canCancelBooking(soonClass)).toBe(false);
  });

  it('no permite cancelar una clase pasada', () => {
    const pastClass = new Date();
    pastClass.setHours(pastClass.getHours() - 1);
    expect(canCancelBooking(pastClass)).toBe(false);
  });
});

describe('Booking — plazas disponibles', () => {
  it('calcula correctamente las plazas libres', () => {
    expect(getSpotsLeft(10, 3)).toBe(7);
    expect(getSpotsLeft(10, 10)).toBe(0);
    expect(getSpotsLeft(10, 0)).toBe(10);
  });

  it('detecta cuando la clase está llena', () => {
    expect(isClassFull(10, 10)).toBe(true);
    expect(isClassFull(10, 9)).toBe(false);
    expect(isClassFull(10, 0)).toBe(false);
  });

  it('retorna estado correcto de plazas', () => {
    expect(getSpotStatus(10, 10)).toBe('full');
    expect(getSpotStatus(10, 8)).toBe('limited');
    expect(getSpotStatus(10, 0)).toBe('available');
  });
});
