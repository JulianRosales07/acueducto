import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CardMatricula from '../components/ComponentesGrupo5/CardMatriculas'

const mockMatricula = {
  cod_matricula: 'M001',
  estado: 'Activa',
  fecha: '2025-03-06',
  tipo_usuario: 'Residencial',
  tarifa: 'Basica',
  predio: {
    tipo: 'Residencial',
    direccion: 'Calle 12 #4-56',
    propietario: {
      cc: '2001',
      nombre: 'Carlos',
      apellido: 'Muñoz'
    }
  }
}

describe('CardMatricula', () => {
  const defaultProps = {
    codigo: mockMatricula.cod_matricula,
    estado: mockMatricula.estado,
    direccion: mockMatricula.predio.direccion,
    fecha: mockMatricula.fecha,
    tipo: mockMatricula.predio.tipo,
    matricula: mockMatricula,
    onClick: vi.fn()
  }

  it('should render matricula information correctly', () => {
    render(<CardMatricula {...defaultProps} />)

    expect(screen.getByText('M001')).toBeInTheDocument()
    expect(screen.getByText('Activa')).toBeInTheDocument()
    expect(screen.getByText('Calle 12 #4-56')).toBeInTheDocument()
    expect(screen.getByText('Creada: 2025-03-06')).toBeInTheDocument()
    expect(screen.getByText('Residencial')).toBeInTheDocument()
    expect(screen.getByText('Haz clic para ver detalles completos')).toBeInTheDocument()
  })

  it('should call onClick when card is clicked', async () => {
    const user = userEvent.setup()
    const mockOnClick = vi.fn()

    render(<CardMatricula {...defaultProps} onClick={mockOnClick} />)

    const card = screen.getByText('M001').closest('div')
    await user.click(card)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('should display different states correctly', () => {
    const inactiveProps = { ...defaultProps, estado: 'Inactiva' }

    render(<CardMatricula {...inactiveProps} />)

    expect(screen.getByText('Inactiva')).toBeInTheDocument()
  })

  it('should display different property types correctly', () => {
    const commercialProps = {
      ...defaultProps,
      tipo: 'Comercial',
      matricula: { ...mockMatricula, predio: { ...mockMatricula.predio, tipo: 'Comercial' } }
    }

    render(<CardMatricula {...commercialProps} />)

    expect(screen.getByText('Comercial')).toBeInTheDocument()
  })

  it('should render with correct CSS classes', () => {
    render(<CardMatricula {...defaultProps} />)

    const card = screen.getByText('M001').closest('div')
    expect(card).toHaveClass('bg-blue-50', 'border', 'border-blue-200', 'rounded-lg', 'p-4', 'shadow-sm', 'cursor-pointer')
  })

  it('should display location icon', () => {
    render(<CardMatricula {...defaultProps} />)

    const locationIcon = document.querySelector('svg')
    expect(locationIcon).toBeInTheDocument()
  })

  it('should display calendar icon', () => {
    render(<CardMatricula {...defaultProps} />)

    const calendarIcon = document.querySelectorAll('svg')[1]
    expect(calendarIcon).toBeInTheDocument()
  })

  it('should display type icon', () => {
    render(<CardMatricula {...defaultProps} />)

    const typeIcon = document.querySelectorAll('svg')[2]
    expect(typeIcon).toBeInTheDocument()
  })

  it('should handle long addresses gracefully', () => {
    const longAddressProps = {
      ...defaultProps,
      direccion: 'Una dirección muy larga que debería mostrarse correctamente en la interfaz de usuario sin problemas de diseño'
    }

    render(<CardMatricula {...longAddressProps} />)

    expect(screen.getByText('Una dirección muy larga que debería mostrarse correctamente en la interfaz de usuario sin problemas de diseño')).toBeInTheDocument()
  })

  it('should be accessible with proper text content', () => {
    render(<CardMatricula {...defaultProps} />)

    expect(screen.getByText('Haz clic para ver detalles completos')).toBeInTheDocument()
  })
})
