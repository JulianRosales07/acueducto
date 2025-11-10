import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormMatricula from '../components/ComponentesGrupo5/FormMatricula'
import { getPredios, createMatricula } from '../services/matriculasService'
import { toast } from 'react-hot-toast'

// Mock dependencies
vi.mock('../services/matriculasService', () => ({
  getPredios: vi.fn(),
  createMatricula: vi.fn(),
}))

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

const mockPredios = [
  {
    id: 1,
    tipo: 'Residencial',
    direccion: 'Calle 12 #4-56',
    propietario: {
      cc: '2001',
      nombre: 'Carlos',
      apellido: 'Muñoz'
    }
  },
  {
    id: 2,
    tipo: 'Comercial',
    direccion: 'Av. Central 89',
    propietario: {
      cc: '2002',
      nombre: 'María',
      apellido: 'López'
    }
  }
]

describe('FormMatricula', () => {
  const mockOnClose = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    getPredios.mockResolvedValue(mockPredios)
  })

  it('should render the form title', () => {
    render(<FormMatricula onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    expect(screen.getByText('Nueva Matrícula')).toBeInTheDocument()
  })

  it('should load predios on mount', async () => {
    render(<FormMatricula onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })
  })

  it('should display all form fields', async () => {
    render(<FormMatricula onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    expect(screen.getByLabelText(/Predio/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Estado del Servicio/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Tipo de Usuario/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Tarifa/)).toBeInTheDocument()
  })

  it('should populate predios select options', async () => {
    render(<FormMatricula onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    const predioSelect = screen.getByLabelText(/Predio/)
    expect(predioSelect).toBeInTheDocument()

    // Check if options are populated (this depends on how the component renders options)
    fireEvent.click(predioSelect)
    // Note: Testing select options might require more specific implementation details
  })

  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    const mockResponse = { cod_matricula: 'M003', estado: 'Activa' }
    createMatricula.mockResolvedValue(mockResponse)

    render(<FormMatricula onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    // Fill form
    const predioSelect = screen.getByLabelText(/Predio/)
    await user.selectOptions(predioSelect, '1')

    const estadoSelect = screen.getByLabelText(/Estado del Servicio/)
    await user.selectOptions(estadoSelect, 'Activa')

    const tipoSelect = screen.getByLabelText(/Tipo de Usuario/)
    await user.selectOptions(tipoSelect, 'Residencial')

    const tarifaSelect = screen.getByLabelText(/Tarifa/)
    await user.selectOptions(tarifaSelect, 'Basica')

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Crear/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(createMatricula).toHaveBeenCalledWith({
        id_predio: '1',
        estado_servicio: 'Activa',
        tipo_usuario: 'Residencial',
        tarifa: 'Basica'
      })
    })

    expect(toast.success).toHaveBeenCalledWith('Matrícula creada con éxito')
    expect(mockOnSuccess).toHaveBeenCalledTimes(1)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should handle form submission errors', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Failed to create matricula'
    createMatricula.mockRejectedValue(new Error(errorMessage))

    render(<FormMatricula onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    // Fill required fields minimally
    const predioSelect = screen.getByLabelText(/Predio/)
    await user.selectOptions(predioSelect, '1')

    const estadoSelect = screen.getByLabelText(/Estado del Servicio/)
    await user.selectOptions(estadoSelect, 'Activa')

    const tipoSelect = screen.getByLabelText(/Tipo de Usuario/)
    await user.selectOptions(tipoSelect, 'Residencial')

    const tarifaSelect = screen.getByLabelText(/Tarifa/)
    await user.selectOptions(tarifaSelect, 'Basica')

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Crear/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
    })

    expect(mockOnSuccess).not.toHaveBeenCalled()
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<FormMatricula onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i })
    await user.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should show loading state during submission', async () => {
    const user = userEvent.setup()
    createMatricula.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<FormMatricula onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    // Fill form
    const predioSelect = screen.getByLabelText(/Predio/)
    await user.selectOptions(predioSelect, '1')

    const estadoSelect = screen.getByLabelText(/Estado del Servicio/)
    await user.selectOptions(estadoSelect, 'Activa')

    const tipoSelect = screen.getByLabelText(/Tipo de Usuario/)
    await user.selectOptions(tipoSelect, 'Residencial')

    const tarifaSelect = screen.getByLabelText(/Tarifa/)
    await user.selectOptions(tarifaSelect, 'Basica')

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Crear/i })
    await user.click(submitButton)

    expect(screen.getByText('Creando...')).toBeInTheDocument()
  })

  it('should disable buttons during submission', async () => {
    const user = userEvent.setup()
    createMatricula.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<FormMatricula onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    // Fill form and submit
    const predioSelect = screen.getByLabelText(/Predio/)
    await user.selectOptions(predioSelect, '1')

    const estadoSelect = screen.getByLabelText(/Estado del Servicio/)
    await user.selectOptions(estadoSelect, 'Activa')

    const tipoSelect = screen.getByLabelText(/Tipo de Usuario/)
    await user.selectOptions(tipoSelect, 'Residencial')

    const tarifaSelect = screen.getByLabelText(/Tarifa/)
    await user.selectOptions(tarifaSelect, 'Basica')

    const submitButton = screen.getByRole('button', { name: /Crear/i })
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeDisabled()
  })

  it('should handle predios loading error', async () => {
    const errorMessage = 'Failed to load predios'
    getPredios.mockRejectedValue(new Error(errorMessage))

    render(<FormMatricula onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al cargar los predios')
    })
  })

  it('should validate required fields', async () => {
    const user = userEvent.setup()
    render(<FormMatricula onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /Crear/i })
    await user.click(submitButton)

    // Form should not submit if required fields are empty
    expect(createMatricula).not.toHaveBeenCalled()
  })

  it('should render modal overlay correctly', () => {
    render(<FormMatricula onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    const modal = document.querySelector('.fixed.inset-0')
    expect(modal).toBeInTheDocument()
    expect(modal).toHaveClass('bg-black', 'bg-opacity-50')
  })

  it('should have proper form structure', async () => {
    render(<FormMatricula onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    const form = screen.getByRole('form')
    expect(form).toBeInTheDocument()

    expect(form).toHaveClass('space-y-4')
  })
})
