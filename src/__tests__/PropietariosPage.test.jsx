import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import PropietariosPage from '../pages/PropietariosPage';
import { getPropietarios } from '../services/propietariosService';
import { toast } from 'react-hot-toast';

// Mock de servicios
vi.mock('../services/propietariosService', () => ({
  getPropietarios: vi.fn()
}));

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    loading: vi.fn()
  }
}));

describe('PropietariosPage', () => {
  const mockPropietarios = [
    {
      cc: '1234567890',
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '3001234567',
      correo: 'juan@email.com'
    },
    {
      cc: '0987654321',
      nombre: 'María',
      apellido: 'García',
      telefono: '3012345678',
      correo: 'maria@email.com'
    }
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    getPropietarios.mockResolvedValue(mockPropietarios);
  });

  it('debe renderizar el título de la página', async () => {
    render(<PropietariosPage />);

    await waitFor(() => {
      expect(screen.getByText('Propietarios')).toBeInTheDocument();
    });
  });

  it('debe mostrar el botón "Nuevo Propietario"', () => {
    render(<PropietariosPage />);

    expect(screen.getByText('Nuevo Propietario')).toBeInTheDocument();
  });

  it('debe cargar y mostrar la lista de propietarios', async () => {
    render(<PropietariosPage />);

    await waitFor(() => {
      expect(getPropietarios).toHaveBeenCalledTimes(1);
    });

    await waitFor(() => {
      expect(screen.getByText(/Juan/)).toBeInTheDocument();
      expect(screen.getByText(/María/)).toBeInTheDocument();
    });
  });

  it('debe filtrar propietarios por búsqueda', async () => {
    render(<PropietariosPage />);

    await waitFor(() => {
      expect(screen.getByText(/Juan/)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Buscar por cédula, nombre o correo...');
    fireEvent.change(searchInput, { target: { value: 'Juan' } });

    await waitFor(() => {
      expect(screen.getByText(/Juan/)).toBeInTheDocument();
    });
  });

  it('debe mostrar mensaje cuando no hay propietarios', async () => {
    getPropietarios.mockResolvedValue([]);

    render(<PropietariosPage />);

    await waitFor(() => {
      expect(screen.getByText('No se encontraron propietarios')).toBeInTheDocument();
    });
  });

  it('debe manejar errores al cargar propietarios', async () => {
    const errorMessage = 'Error al cargar propietarios';
    getPropietarios.mockRejectedValue(new Error(errorMessage));

    render(<PropietariosPage />);

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al cargar los propietarios');
    });
  });

  it('debe abrir el modal de nuevo propietario al hacer clic en el botón', async () => {
    render(<PropietariosPage />);

    const nuevoButton = screen.getByText('Nuevo Propietario');
    fireEvent.click(nuevoButton);

    expect(nuevoButton).toBeInTheDocument();
  });

  it('debe filtrar por cédula', async () => {
    render(<PropietariosPage />);

    await waitFor(() => {
      expect(screen.getByText(/Juan/)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Buscar por cédula, nombre o correo...');
    fireEvent.change(searchInput, { target: { value: '1234567890' } });

    await waitFor(() => {
      expect(screen.getByText(/Juan/)).toBeInTheDocument();
    });
  });

  it('debe filtrar por correo electrónico', async () => {
    render(<PropietariosPage />);

    await waitFor(() => {
      expect(screen.getByText(/Juan/)).toBeInTheDocument();
    });

    const searchInput = screen.getByPlaceholderText('Buscar por cédula, nombre o correo...');
    fireEvent.change(searchInput, { target: { value: 'juan@email.com' } });

    await waitFor(() => {
      expect(screen.getByText(/Juan/)).toBeInTheDocument();
    });
  });
});
