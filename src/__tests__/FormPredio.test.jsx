import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import FormPredio from '../components/ComponentesGrupo5/FormPredio'

vi.mock('../services/prediosService', () => ({
  getPropietarios: vi.fn(() => Promise.resolve([])),
  createPredio: vi.fn(),
  updatePredio: vi.fn(),
}))

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    loading: vi.fn(() => 'toast-id'),
    dismiss: vi.fn()
  },
}))

describe('FormPredio', () => {
  const mockOnClose = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe renderizar el formulario de creación', () => {
    render(<FormPredio onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    expect(screen.getByText('Nuevo Predio')).toBeInTheDocument()
  })

  it('debe renderizar el formulario de edición', () => {
    const mockPredio = {
      id: 1,
      direccion: 'Calle 12 #4-56',
      tipo: 'Residencial',
      telefono: '3001234567',
      correo: 'test@email.com',
      propietario_cc: '2001'
    }

    render(<FormPredio predio={mockPredio} onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    expect(screen.getByText('Editar Predio')).toBeInTheDocument()
  })
})
