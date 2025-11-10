import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormPropietario from '../components/ComponentesGrupo5/FormPropietario';
import { createPropietario, updatePropietario, getPropietarios } from '../services/propietariosService';
import { toast } from 'react-hot-toast';

// Mock de servicios
vi.mock('../services/propietariosService', () => ({
  createPropietario: vi.fn(),
  updatePropietario: vi.fn(),
  getPropietarios: vi.fn()
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn()
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
    getPropietarios.mockResolvedValue([]);
  });

  describe('Modo creación', () => {
    it('debe renderizar el formulario de creación correctamente', () => {
      render(<FormPropietario {...defaultProps} />);

      expect(screen.getByText('Nuevo Propietario')).toBeInTheDocument();
      expect(screen.getByLabelText(/Cédula/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Nombre/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Apellido/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Teléfono/)).toBeInTheDocument();
      expect(screen.getByLabelText(/Correo Electrónico/)).toBeInTheDocument();
      expect(screen.getByText('Guardar')).toBeInTheDocument();
      expect(screen.getByText('Cancelar')).toBeInTheDocument();
    });

    it('debe crear un propietario correctamente', async () => {
      createPropietario.mockResolvedValue({ cc: '1234567890' });

      render(<FormPropietario {...defaultProps} />);

      fireEvent.change(screen.getByLabelText(/Cédula/), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Juan' } });
      fireEvent.change(screen.getByLabelText(/Apellido/), { target: { value: 'Pérez' } });
      fireEvent.change(screen.getByLabelText(/Teléfono/), { target: { value: '3001234567' } });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico/), { target: { value: 'juan@email.com' } });

      fireEvent.click(screen.getByText('Guardar'));

      await waitFor(() => {
        expect(createPropietario).toHaveBeenCalledWith({
          cc: '1234567890',
          nombre: 'Juan',
          apellido: 'Pérez',
          telefono: '3001234567',
          correo: 'juan@email.com'
        });
        expect(toast.success).toHaveBeenCalledWith('Propietario registrado con éxito');
        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
      });
    });

    it('debe validar que la cédula no esté vacía', async () => {
      render(<FormPropietario {...defaultProps} />);

      fireEvent.click(screen.getByText('Guardar'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('La cédula es requerida');
      });
    });

    it('debe validar que la cédula contenga solo números', async () => {
      render(<FormPropietario {...defaultProps} />);

      fireEvent.change(screen.getByLabelText(/Cédula/), { target: { value: 'abc123' } });
      fireEvent.click(screen.getByText('Guardar'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('La cédula debe contener solo números');
      });
    });

    it('debe validar que el nombre no esté vacío', async () => {
      render(<FormPropietario {...defaultProps} />);

      fireEvent.change(screen.getByLabelText(/Cédula/), { target: { value: '1234567890' } });
      fireEvent.click(screen.getByText('Guardar'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('El nombre es requerido');
      });
    });

    it('debe validar que el apellido no esté vacío', async () => {
      render(<FormPropietario {...defaultProps} />);

      fireEvent.change(screen.getByLabelText(/Cédula/), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Juan' } });
      fireEvent.click(screen.getByText('Guardar'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('El apellido es requerido');
      });
    });

    it('debe validar que el teléfono no esté vacío', async () => {
      render(<FormPropietario {...defaultProps} />);

      fireEvent.change(screen.getByLabelText(/Cédula/), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Juan' } });
      fireEvent.change(screen.getByLabelText(/Apellido/), { target: { value: 'Pérez' } });
      fireEvent.click(screen.getByText('Guardar'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('El teléfono es requerido');
      });
    });

    it('debe validar que el teléfono tenga 10 dígitos', async () => {
      render(<FormPropietario {...defaultProps} />);

      fireEvent.change(screen.getByLabelText(/Cédula/), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Juan' } });
      fireEvent.change(screen.getByLabelText(/Apellido/), { target: { value: 'Pérez' } });
      fireEvent.change(screen.getByLabelText(/Teléfono/), { target: { value: '300123' } });
      fireEvent.click(screen.getByText('Guardar'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('El teléfono debe tener 10 dígitos');
      });
    });

    it('debe validar que el correo no esté vacío', async () => {
      render(<FormPropietario {...defaultProps} />);

      fireEvent.change(screen.getByLabelText(/Cédula/), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Juan' } });
      fireEvent.change(screen.getByLabelText(/Apellido/), { target: { value: 'Pérez' } });
      fireEvent.change(screen.getByLabelText(/Teléfono/), { target: { value: '3001234567' } });
      fireEvent.click(screen.getByText('Guardar'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('El correo es requerido');
      });
    });

    it('debe validar el formato del correo electrónico', async () => {
      render(<FormPropietario {...defaultProps} />);

      fireEvent.change(screen.getByLabelText(/Cédula/), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Juan' } });
      fireEvent.change(screen.getByLabelText(/Apellido/), { target: { value: 'Pérez' } });
      fireEvent.change(screen.getByLabelText(/Teléfono/), { target: { value: '3001234567' } });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico/), { target: { value: 'correo-invalido' } });
      fireEvent.click(screen.getByText('Guardar'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('El correo electrónico no tiene un formato válido');
      });
    });

    it('debe validar que no se creen propietarios duplicados', async () => {
      getPropietarios.mockResolvedValue([{ cc: '1234567890' }]);

      render(<FormPropietario {...defaultProps} />);

      fireEvent.change(screen.getByLabelText(/Cédula/), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Juan' } });
      fireEvent.change(screen.getByLabelText(/Apellido/), { target: { value: 'Pérez' } });
      fireEvent.change(screen.getByLabelText(/Teléfono/), { target: { value: '3001234567' } });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico/), { target: { value: 'juan@email.com' } });

      fireEvent.click(screen.getByText('Guardar'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Ya existe un propietario con esta cédula');
      });
    });

    it('debe llamar a onClose cuando se hace clic en Cancelar', () => {
      render(<FormPropietario {...defaultProps} />);

      fireEvent.click(screen.getByText('Cancelar'));

      expect(mockOnClose).toHaveBeenCalledTimes(1);
    });
  });

  describe('Modo edición', () => {
    const propietarioExistente = {
      cc: '1234567890',
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '3001234567',
      correo: 'juan@email.com'
    };

    it('debe renderizar el formulario de edición correctamente', () => {
      render(<FormPropietario {...defaultProps} propietario={propietarioExistente} />);

      expect(screen.getByText('Editar Propietario')).toBeInTheDocument();
      expect(screen.getByDisplayValue('1234567890')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Juan')).toBeInTheDocument();
      expect(screen.getByDisplayValue('Pérez')).toBeInTheDocument();
      expect(screen.getByDisplayValue('3001234567')).toBeInTheDocument();
      expect(screen.getByDisplayValue('juan@email.com')).toBeInTheDocument();
    });

    it('debe deshabilitar el campo de cédula en modo edición', () => {
      render(<FormPropietario {...defaultProps} propietario={propietarioExistente} />);

      const cedulaInput = screen.getByLabelText(/Cédula/);
      expect(cedulaInput).toBeDisabled();
      expect(screen.getByText('La cédula no se puede modificar')).toBeInTheDocument();
    });

    it('debe actualizar un propietario correctamente', async () => {
      updatePropietario.mockResolvedValue({ ...propietarioExistente, nombre: 'Juan Carlos' });

      render(<FormPropietario {...defaultProps} propietario={propietarioExistente} />);

      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Juan Carlos' } });
      fireEvent.click(screen.getByText('Guardar'));

      await waitFor(() => {
        expect(updatePropietario).toHaveBeenCalledWith('1234567890', {
          cc: '1234567890',
          nombre: 'Juan Carlos',
          apellido: 'Pérez',
          telefono: '3001234567',
          correo: 'juan@email.com'
        });
        expect(toast.success).toHaveBeenCalledWith('Propietario actualizado con éxito');
        expect(mockOnSuccess).toHaveBeenCalled();
        expect(mockOnClose).toHaveBeenCalled();
      });
    });
  });

  describe('Manejo de errores', () => {
    it('debe manejar errores al crear propietario', async () => {
      createPropietario.mockRejectedValue(new Error('Error de servidor'));

      render(<FormPropietario {...defaultProps} />);

      fireEvent.change(screen.getByLabelText(/Cédula/), { target: { value: '1234567890' } });
      fireEvent.change(screen.getByLabelText(/Nombre/), { target: { value: 'Juan' } });
      fireEvent.change(screen.getByLabelText(/Apellido/), { target: { value: 'Pérez' } });
      fireEvent.change(screen.getByLabelText(/Teléfono/), { target: { value: '3001234567' } });
      fireEvent.change(screen.getByLabelText(/Correo Electrónico/), { target: { value: 'juan@email.com' } });

      fireEvent.click(screen.getByText('Guardar'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error de servidor');
      });
    });

    it('debe manejar errores al actualizar propietario', async () => {
      updatePropietario.mockRejectedValue(new Error('Error al actualizar'));

      render(<FormPropietario {...defaultProps} propietario={{ cc: '1234567890', nombre: 'Juan', apellido: 'Pérez', telefono: '3001234567', correo: 'juan@email.com' }} />);

      fireEvent.click(screen.getByText('Guardar'));

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith('Error al actualizar');
      });
    });
  });
});
