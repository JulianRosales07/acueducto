import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import FormPropietario from '../components/ComponentesGrupo5/FormPropietario';

vi.mock('../services/propietariosService', () => ({
  createPropietario: vi.fn(),
  updatePropietario: vi.fn(),
  getPropietarios: vi.fn(() => Promise.resolve([]))
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    loading: vi.fn(() => 'toast-id'),
    dismiss: vi.fn()
  }
}));

describe('FormPropietario', () => {
  const mockOnClose = vi.fn();
  const mockOnSuccess = vi.fn();

  const defaultProps = {
    onClose: mockOnClose,
    onSuccess: mockOnSuccess
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar el formulario de creación correctamente', () => {
    render(<FormPropietario {...defaultProps} />);

    expect(screen.getByText('Nuevo Propietario')).toBeInTheDocument();
    expect(screen.getByText('Guardar')).toBeInTheDocument();
    expect(screen.getByText('Cancelar')).toBeInTheDocument();
  });

  it('debe renderizar el formulario de edición correctamente', () => {
    const propietarioExistente = {
      cc: '1234567890',
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '3001234567',
      correo: 'juan@email.com'
    };

    render(<FormPropietario {...defaultProps} propietario={propietarioExistente} />);

    expect(screen.getByText('Editar Propietario')).toBeInTheDocument();
    expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
    expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();
  });
});
