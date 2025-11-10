import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import FormMatricula from '../components/ComponentesGrupo5/FormMatricula'

vi.mock('../services/matriculasService', () => ({
  getPredios: vi.fn(() => Promise.resolve([])),
  getMatriculas: vi.fn(() => Promise.resolve([])),
  createMatricula: vi.fn(),
  updateMatricula: vi.fn(),
}))

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    loading: vi.fn(() => 'toast-id'),
    dismiss: vi.fn()
  },
}))

describe('FormMatricula', () => {
  const mockOnClose = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('debe renderizar el formulario de creación', () => {
    render(<FormMatricula onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    expect(screen.getByText('Nueva Matrícula')).toBeInTheDocument()
  })

  it('debe renderizar el formulario con matrícula existente', () => {
    const mockMatricula = {
      cod_matricula: 'M001',
      estado: 'Activa',
      predio: {
        id: 1,
        direccion: 'Calle 12 #4-56'
      },
      tipo_usuario: 'Residencial',
      tarifa: 'Basica'
    }

    const { container } = render(<FormMatricula matricula={mockMatricula} onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    expect(container).toBeTruthy()
    expect(screen.getByText('Guardar')).toBeInTheDocument()
  })
})
