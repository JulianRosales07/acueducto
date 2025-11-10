import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FormPredio from '../components/ComponentesGrupo5/FormPredio'
import { getPropietarios, createPredio, updatePredio } from '../services/prediosService'
import { toast } from 'react-hot-toast'

// Mock dependencies
vi.mock('../services/prediosService', () => ({
  getPropietarios: vi.fn(),
  createPredio: vi.fn(),
  updatePredio: vi.fn(),
}))

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

const mockPropietarios = [
  {
    cc: '2001',
    nombre: 'Carlos Muñoz'
  },
  {
    cc: '2002',
    nombre: 'María López'
  }
]

describe('FormPredio', () => {
  const mockOnClose = vi.fn()
  const mockOnSuccess = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
    getPropietarios.mockResolvedValue(mockPropietarios)
  })

  it('should render the form title for new predio', () => {
    render(<FormPredio onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    expect(screen.getByText('Nuevo Predio')).toBeInTheDocument()
  })

  it('should render the form title for editing predio', () => {
    const mockPredio = { id: 1, direccion: 'Calle 12 #4-56' }
    render(<FormPredio predio={mockPredio} onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    expect(screen.getByText('Editar Predio')).toBeInTheDocument()
  })

  it('should load propietarios on mount', async () => {
    render(<FormPredio onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPropietarios).toHaveBeenCalledTimes(1)
    })
  })

  it('should display all form fields', async () => {
    render(<FormPredio onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPropietarios).toHaveBeenCalledTimes(1)
    })

    expect(screen.getByLabelText(/Dirección/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Propietario/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Teléfono/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Correo Electrónico/)).toBeInTheDocument()
    expect(screen.getByLabelText(/Tipo de Predio/)).toBeInTheDocument()
  })

  it('should populate propietarios select options', async () => {
    render(<FormPredio onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPropietarios).toHaveBeenCalledTimes(1)
    })

    const propietarioSelect = screen.getByLabelText(/Propietario/)
    expect(propietarioSelect).toBeInTheDocument()
  })

  it('should submit form with valid data for new predio', async () => {
    const user = userEvent.setup()
    const mockResponse = { id: 3, direccion: 'Nueva Calle 123' }
    createPredio.mockResolvedValue(mockResponse)

    render(<FormPredio onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPropietarios).toHaveBeenCalledTimes(1)
    })

    // Fill form
    const direccionInput = screen.getByLabelText(/Dirección/)
    await user.type(direccionInput, 'Nueva Calle 123')

    const propietarioSelect = screen.getByLabelText(/Propietario/)
    await user.selectOptions(propietarioSelect, '2001')

    const telefonoInput = screen.getByLabelText(/Teléfono/)
    await user.type(telefonoInput, '3001234567')

    const correoInput = screen.getByLabelText(/Correo Electrónico/)
    await user.type(correoInput, 'nuevo@email.com')

    const tipoSelect = screen.getByLabelText(/Tipo de Predio/)
    await user.selectOptions(tipoSelect, 'Residencial')

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Guardar/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(createPredio).toHaveBeenCalledWith({
        direccion: 'Nueva Calle 123',
        id_propietario: '2001',
        telefono: '3001234567',
        correo: 'nuevo@email.com',
        tipo: 'Residencial'
      })
    })

    expect(toast.success).toHaveBeenCalledWith('Predio registrado con éxito')
    expect(mockOnSuccess).toHaveBeenCalledTimes(1)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should submit form with valid data for editing predio', async () => {
    const user = userEvent.setup()
    const mockPredio = {
      id: 1,
      direccion: 'Calle 12 #4-56',
      id_propietario: '2001',
      telefono: '3001234567',
      correo: 'carlos@email.com',
      tipo: 'Residencial'
    }
    const mockResponse = { ...mockPredio, direccion: 'Calle Actualizada' }
    updatePredio.mockResolvedValue(mockResponse)

    render(<FormPredio predio={mockPredio} onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPropietarios).toHaveBeenCalledTimes(1)
    })

    // Modify form
    const direccionInput = screen.getByLabelText(/Dirección/)
    await user.clear(direccionInput)
    await user.type(direccionInput, 'Calle Actualizada')

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Guardar/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(updatePredio).toHaveBeenCalledWith(1, {
        direccion: 'Calle Actualizada',
        id_propietario: '2001',
        telefono: '3001234567',
        correo: 'carlos@email.com',
        tipo: 'Residencial'
      })
    })

    expect(toast.success).toHaveBeenCalledWith('Predio actualizado con éxito')
    expect(mockOnSuccess).toHaveBeenCalledTimes(1)
    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should handle form submission errors', async () => {
    const user = userEvent.setup()
    const errorMessage = 'Failed to create predio'
    createPredio.mockRejectedValue(new Error(errorMessage))

    render(<FormPredio onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPropietarios).toHaveBeenCalledTimes(1)
    })

    // Fill required fields
    const direccionInput = screen.getByLabelText(/Dirección/)
    await user.type(direccionInput, 'Nueva Calle 123')

    const propietarioSelect = screen.getByLabelText(/Propietario/)
    await user.selectOptions(propietarioSelect, '2001')

    const telefonoInput = screen.getByLabelText(/Teléfono/)
    await user.type(telefonoInput, '3001234567')

    const correoInput = screen.getByLabelText(/Correo Electrónico/)
    await user.type(correoInput, 'nuevo@email.com')

    const tipoSelect = screen.getByLabelText(/Tipo de Predio/)
    await user.selectOptions(tipoSelect, 'Residencial')

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Guardar/i })
    await user.click(submitButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith(errorMessage)
    })

    expect(mockOnSuccess).not.toHaveBeenCalled()
    expect(mockOnClose).not.toHaveBeenCalled()
  })

  it('should call onClose when cancel button is clicked', async () => {
    const user = userEvent.setup()
    render(<FormPredio onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    const cancelButton = screen.getByRole('button', { name: /Cancelar/i })
    await user.click(cancelButton)

    expect(mockOnClose).toHaveBeenCalledTimes(1)
  })

  it('should show loading state during submission', async () => {
    const user = userEvent.setup()
    createPredio.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<FormPredio onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPropietarios).toHaveBeenCalledTimes(1)
    })

    // Fill form
    const direccionInput = screen.getByLabelText(/Dirección/)
    await user.type(direccionInput, 'Nueva Calle 123')

    const propietarioSelect = screen.getByLabelText(/Propietario/)
    await user.selectOptions(propietarioSelect, '2001')

    const telefonoInput = screen.getByLabelText(/Teléfono/)
    await user.type(telefonoInput, '3001234567')

    const correoInput = screen.getByLabelText(/Correo Electrónico/)
    await user.type(correoInput, 'nuevo@email.com')

    const tipoSelect = screen.getByLabelText(/Tipo de Predio/)
    await user.selectOptions(tipoSelect, 'Residencial')

    // Submit form
    const submitButton = screen.getByRole('button', { name: /Guardar/i })
    await user.click(submitButton)

    expect(screen.getByText('Guardando...')).toBeInTheDocument()
  })

  it('should disable buttons during submission', async () => {
    const user = userEvent.setup()
    createPredio.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<FormPredio onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPropietarios).toHaveBeenCalledTimes(1)
    })

    // Fill form and submit
    const direccionInput = screen.getByLabelText(/Dirección/)
    await user.type(direccionInput, 'Nueva Calle 123')

    const propietarioSelect = screen.getByLabelText(/Propietario/)
    await user.selectOptions(propietarioSelect, '2001')

    const telefonoInput = screen.getByLabelText(/Teléfono/)
    await user.type(telefonoInput, '3001234567')

    const correoInput = screen.getByLabelText(/Correo Electrónico/)
    await user.type(correoInput, 'nuevo@email.com')

    const tipoSelect = screen.getByLabelText(/Tipo de Predio/)
    await user.selectOptions(tipoSelect, 'Residencial')

    const submitButton = screen.getByRole('button', { name: /Guardar/i })
    await user.click(submitButton)

    expect(submitButton).toBeDisabled()
    expect(screen.getByRole('button', { name: /Cancelar/i })).toBeDisabled()
  })

  it('should handle propietarios loading error', async () => {
    const errorMessage = 'Failed to load propietarios'
    getPropietarios.mockRejectedValue(new Error(errorMessage))

    render(<FormPredio onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al cargar los propietarios')
    })
  })

  it('should validate required fields', async () => {
    const user = userEvent.setup()
    render(<FormPredio onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPropietarios).toHaveBeenCalledTimes(1)
    })

    // Try to submit without filling required fields
    const submitButton = screen.getByRole('button', { name: /Guardar/i })
    await user.click(submitButton)

    // Form should not submit if required fields are empty
    expect(createPredio).not.toHaveBeenCalled()
  })

  it('should render modal overlay correctly', () => {
    render(<FormPredio onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    const modal = document.querySelector('.fixed.inset-0')
    expect(modal).toBeInTheDocument()
    expect(modal).toHaveClass('bg-black', 'bg-opacity-50')
  })

  it('should have proper form structure', async () => {
    render(<FormPredio onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPropietarios).toHaveBeenCalledTimes(1)
    })

    const form = screen.getByRole('form')
    expect(form).toBeInTheDocument()

    expect(form).toHaveClass('space-y-4')
  })

  it('should pre-fill form when editing existing predio', async () => {
    const mockPredio = {
      id: 1,
      direccion: 'Calle 12 #4-56',
      id_propietario: '2001',
      telefono: '3001234567',
      correo: 'carlos@email.com',
      tipo: 'Residencial'
    }

    render(<FormPredio predio={mockPredio} onClose={mockOnClose} onSuccess={mockOnSuccess} />)

    await waitFor(() => {
      expect(getPropietarios).toHaveBeenCalledTimes(1)
    })

    expect(screen.getByDisplayValue('Calle 12 #4-56')).toBeInTheDocument()
    expect(screen.getByDisplayValue('3001234567')).toBeInTheDocument()
    expect(screen.getByDisplayValue('carlos@email.com')).toBeInTheDocument()
  })
})
