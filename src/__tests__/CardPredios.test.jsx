import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import CardPredios from '../components/ComponentesGrupo5/CardPredios'

const mockPredio = {
  id: 1,
  direccion: 'Calle 12 #4-56',
  tipo: 'Residencial',
  telefono: '3001234567',
  correo: 'propietario@email.com',
  fecha_registro: '2025-03-06',
  propietario: {
    cc: '2001',
    nombre: 'Carlos Muñoz'
  }
}

describe('CardPredios', () => {
  const defaultProps = {
    id: mockPredio.id,
    direccion: mockPredio.direccion,
    propietario: mockPredio.propietario.nombre,
    telefono: mockPredio.telefono,
    correo: mockPredio.correo,
    tipo: mockPredio.tipo,
    fechaRegistro: mockPredio.fecha_registro,
    predio: mockPredio,
    onClick: vi.fn()
  }

  it('should render predio information correctly', () => {
    render(<CardPredios {...defaultProps} />)

    expect(screen.getByText('Predio #1')).toBeInTheDocument()
    expect(screen.getByText('Residencial')).toBeInTheDocument()
    expect(screen.getByText('Calle 12 #4-56')).toBeInTheDocument()
    expect(screen.getByText('Carlos Muñoz')).toBeInTheDocument()
    expect(screen.getByText('3001234567')).toBeInTheDocument()
    expect(screen.getByText('propietario@email.com')).toBeInTheDocument()
    expect(screen.getByText('Registrado: 2025-03-06')).toBeInTheDocument()
    expect(screen.getByText('Haz clic para ver detalles completos')).toBeInTheDocument()
  })

  it('should call onClick when card is clicked', async () => {
    const user = userEvent.setup()
    const mockOnClick = vi.fn()

    render(<CardPredios {...defaultProps} onClick={mockOnClick} />)

    const card = screen.getByText('Predio #1').closest('div')
    await user.click(card)

    expect(mockOnClick).toHaveBeenCalledTimes(1)
  })

  it('should display different property types correctly', () => {
    const commercialProps = { ...defaultProps, tipo: 'Comercial' }

    render(<CardPredios {...commercialProps} />)

    expect(screen.getByText('Comercial')).toBeInTheDocument()
  })

  it('should render with correct CSS classes', () => {
    render(<CardPredios {...defaultProps} />)

    const card = screen.getByText('Predio #1').closest('div')
    expect(card).toHaveClass('bg-green-50', 'border', 'border-green-200', 'rounded-lg', 'p-4', 'shadow-sm', 'cursor-pointer')
  })

  it('should display location icon', () => {
    render(<CardPredios {...defaultProps} />)

    const locationIcon = document.querySelector('svg')
    expect(locationIcon).toBeInTheDocument()
  })

  it('should display user icon', () => {
    render(<CardPredios {...defaultProps} />)

    const userIcon = document.querySelectorAll('svg')[1]
    expect(userIcon).toBeInTheDocument()
  })

  it('should display phone icon', () => {
    render(<CardPredios {...defaultProps} />)

    const phoneIcon = document.querySelectorAll('svg')[2]
    expect(phoneIcon).toBeInTheDocument()
  })

  it('should display email icon', () => {
    render(<CardPredios {...defaultProps} />)

    const emailIcon = document.querySelectorAll('svg')[3]
    expect(emailIcon).toBeInTheDocument()
  })

  it('should display calendar icon', () => {
    render(<CardPredios {...defaultProps} />)

    const calendarIcon = document.querySelectorAll('svg')[4]
    expect(calendarIcon).toBeInTheDocument()
  })

  it('should handle long addresses gracefully', () => {
    const longAddressProps = {
      ...defaultProps,
      direccion: 'Una dirección muy larga que debería mostrarse correctamente en la interfaz de usuario sin problemas de diseño'
    }

    render(<CardPredios {...longAddressProps} />)

    expect(screen.getByText('Una dirección muy larga que debería mostrarse correctamente en la interfaz de usuario sin problemas de diseño')).toBeInTheDocument()
  })

  it('should be accessible with proper text content', () => {
    render(<CardPredios {...defaultProps} />)

    expect(screen.getByText('Haz clic para ver detalles completos')).toBeInTheDocument()
  })

  it('should display different IDs correctly', () => {
    const differentIdProps = { ...defaultProps, id: 42 }

    render(<CardPredios {...differentIdProps} />)

    expect(screen.getByText('Predio #42')).toBeInTheDocument()
  })
})
