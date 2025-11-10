import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import CardPropietarios from '../components/ComponentesGrupo5/CardPropietarios';

describe('CardPropietarios', () => {
  const mockOnClick = vi.fn();

  const defaultProps = {
    cc: '1234567890',
    nombre: 'Juan',
    apellido: 'Pérez',
    telefono: '3001234567',
    correo: 'juan@email.com',
    onClick: mockOnClick,
    propietario: {
      cc: '1234567890',
      nombre: 'Juan',
      apellido: 'Pérez',
      telefono: '3001234567',
      correo: 'juan@email.com'
    }
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('debe renderizar correctamente la información del propietario', () => {
    render(<CardPropietarios {...defaultProps} />);

    expect(screen.getByText('Juan Pérez')).toBeInTheDocument();
    expect(screen.getByText('CC: 1234567890')).toBeInTheDocument();
    expect(screen.getByText('Juan Pérez')).toBeInTheDocument(); // Nombre completo
    expect(screen.getByText('3001234567')).toBeInTheDocument();
    expect(screen.getByText('juan@email.com')).toBeInTheDocument();
    expect(screen.getByText('Haz clic para ver detalles completos')).toBeInTheDocument();
  });

  it('debe llamar a onClick cuando se hace clic en la tarjeta', () => {
    render(<CardPropietarios {...defaultProps} />);

    const card = screen.getByText('Juan Pérez').closest('div');
    fireEvent.click(card);

    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockOnClick).toHaveBeenCalledWith(defaultProps.propietario);
  });

  it('debe mostrar el nombre y apellido correctamente', () => {
    render(<CardPropietarios {...defaultProps} />);

    const nombreCompleto = screen.getAllByText('Juan Pérez');
    expect(nombreCompleto.length).toBeGreaterThan(0);
  });

  it('debe mostrar la cédula en el badge', () => {
    render(<CardPropietarios {...defaultProps} />);

    expect(screen.getByText('CC: 1234567890')).toBeInTheDocument();
  });

  it('debe mostrar la información de contacto', () => {
    render(<CardPropietarios {...defaultProps} />);

    expect(screen.getByText('3001234567')).toBeInTheDocument();
    expect(screen.getByText('juan@email.com')).toBeInTheDocument();
  });

  it('debe tener la clase CSS correcta para el estilo', () => {
    render(<CardPropietarios {...defaultProps} />);

    const card = screen.getByText('Juan Pérez').closest('div');
    expect(card).toHaveClass('bg-purple-50', 'border-purple-200');
  });

  it('debe renderizar con diferentes datos', () => {
    const differentProps = {
      ...defaultProps,
      cc: '0987654321',
      nombre: 'María',
      apellido: 'García',
      telefono: '3012345678',
      correo: 'maria@email.com'
    };

    render(<CardPropietarios {...differentProps} />);

    expect(screen.getByText('María García')).toBeInTheDocument();
    expect(screen.getByText('CC: 0987654321')).toBeInTheDocument();
    expect(screen.getByText('3012345678')).toBeInTheDocument();
    expect(screen.getByText('maria@email.com')).toBeInTheDocument();
  });
});
