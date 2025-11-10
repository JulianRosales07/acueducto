import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PrediosPage from '../pages/PrediosPage'
import { getPredios, deletePredio } from '../services/prediosService'
import { toast } from 'react-hot-toast'

// Mock dependencies
vi.mock('../services/prediosService', () => ({
  getPredios: vi.fn(),
  deletePredio: vi.fn(),
}))

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock('../components/ComponentesGrupo5/CardPredios', () => ({
  default: ({ id, direccion, propietario, telefono, correo, tipo, fechaRegistro, predio, onClick }) => (
    <div data-testid={`card-${id}`} onClick={() => onClick(predio)}>
      <h2>Predio #{id}</h2>
      <span>{tipo}</span>
      <p>{direccion}</p>
      <p>{propietario}</p>
      <p>{telefono}</p>
      <p>{correo}</p>
      <p>Registrado: {fechaRegistro}</p>
      <p>Haz clic para ver detalles completos</p>
    </div>
  ),
}))

vi.mock('../components/ComponentesGrupo5/FormPredio', () => ({
  default: ({ onClose, onSuccess, predio }) => (
    <div data-testid="form-predio">
      <button onClick={onClose}>Close</button>
      <button onClick={onSuccess}>Success</button>
      {predio && <span>Editing predio {predio.id}</span>}
    </div>
  ),
}))

// Mock window.confirm
global.confirm = vi.fn(() => true)

const mockPredios = [
  {
    id: 1,
    direccion: 'Calle 12 #4-56',
    tipo: 'Residencial',
    telefono: '3001234567',
    correo: 'carlos@email.com',
    fecha_registro: '2025-03-06',
    propietario: {
      cc: '2001',
      nombre: 'Carlos Muñoz'
    }
  },
  {
    id: 2,
    direccion: 'Av. Central 89',
    tipo: 'Comercial',
    telefono: '3012345678',
    correo: 'maria@email.com',
    fecha_registro: '2025-03-11',
    propietario: {
      cc: '2002',
      nombre: 'María López'
    }
  }
]

describe('PrediosPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getPredios.mockResolvedValue(mockPredios)
    global.confirm.mockReturnValue(true)
  })

  it('should render the page title', () => {
    render(<PrediosPage />)

    expect(screen.getByText('Gestión de Predios')).toBeInTheDocument()
  })

  it('should render the new predio button', () => {
    render(<PrediosPage />)

    expect(screen.getByText('Nuevo Predio')).toBeInTheDocument()
  })

  it('should load and display predios on mount', async () => {
    render(<PrediosPage />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    expect(screen.getByTestId('card-1')).toBeInTheDocument()
    expect(screen.getByTestId('card-2')).toBeInTheDocument()
  })

  it('should display loading state initially', () => {
    getPredios.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<PrediosPage />)

    expect(screen.getByText('Gestión de Predios')).toBeInTheDocument()
    // Cards should not be visible yet
    expect(screen.queryByTestId('card-1')).not.toBeInTheDocument()
  })

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'Failed to load predios'
    getPredios.mockRejectedValue(new Error(errorMessage))

    render(<PrediosPage />)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al cargar los predios')
    })
  })

  it('should open form modal when new predio button is clicked', async () => {
    const user = userEvent.setup()
    render(<PrediosPage />)

    const newButton = screen.getByText('Nuevo Predio')
    await user.click(newButton)

    expect(screen.getByTestId('form-predio')).toBeInTheDocument()
  })

  it('should close form modal when onClose is called', async () => {
    const user = userEvent.setup()
    render(<PrediosPage />)

    // Open form
    const newButton = screen.getByText('Nuevo Predio')
    await user.click(newButton)

    // Close form
    const closeButton = screen.getByText('Close')
    await user.click(closeButton)

    expect(screen.queryByTestId('form-predio')).not.toBeInTheDocument()
  })

  it('should reload predios when form success callback is triggered', async () => {
    const user = userEvent.setup()
    render(<PrediosPage />)

    // Open form
    const newButton = screen.getByText('Nuevo Predio')
    await user.click(newButton)

    // Trigger success
    const successButton = screen.getByText('Success')
    await user.click(successButton)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(2) // Initial load + reload after success
    })
  })

  it('should filter predios based on search input', async () => {
    const user = userEvent.setup()
    render(<PrediosPage />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    // Search by address
    const searchInput = screen.getByPlaceholderText(/Ej: Calle 123 o 1234567890 o Juan Pérez/)
    await user.type(searchInput, 'Calle 12')

    expect(screen.getByTestId('card-1')).toBeInTheDocument()
    expect(screen.queryByTestId('card-2')).not.toBeInTheDocument()
  })

  it('should filter predios by propietario CC', async () => {
    const user = userEvent.setup()
    render(<PrediosPage />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    // Search by CC
    const searchInput = screen.getByPlaceholderText(/Ej: Calle 123 o 1234567890 o Juan Pérez/)
    await user.type(searchInput, '2002')

    expect(screen.queryByTestId('card-1')).not.toBeInTheDocument()
    expect(screen.getByTestId('card-2')).toBeInTheDocument()
  })

  it('should filter predios by propietario name', async () => {
    const user = userEvent.setup()
    render(<PrediosPage />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    // Search by name
    const searchInput = screen.getByPlaceholderText(/Ej: Calle 123 o 1234567890 o Juan Pérez/)
    await user.type(searchInput, 'María')

    expect(screen.queryByTestId('card-1')).not.toBeInTheDocument()
    expect(screen.getByTestId('card-2')).toBeInTheDocument()
  })

  it('should display correct count when searching', async () => {
    const user = userEvent.setup()
    render(<PrediosPage />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    // Search for specific predio
    const searchInput = screen.getByPlaceholderText(/Ej: Calle 123 o 1234567890 o Juan Pérez/)
    await user.type(searchInput, 'Calle 12')

    expect(screen.getByText('Se encontraron 1 predio(s)')).toBeInTheDocument()
  })

  it('should display total count when no search', async () => {
    render(<PrediosPage />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    expect(screen.getByText('Existen 2 registros de predio(s)')).toBeInTheDocument()
  })

  it('should show no results message when no predios match search', async () => {
    const user = userEvent.setup()
    render(<PrediosPage />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    // Search for non-existent predio
    const searchInput = screen.getByPlaceholderText(/Ej: Calle 123 o 1234567890 o Juan Pérez/)
    await user.type(searchInput, 'NONEXISTENT')

    expect(screen.getByText('No se encontraron predios')).toBeInTheDocument()
  })

  it('should open details modal when predio card is clicked', async () => {
    const user = userEvent.setup()
    render(<PrediosPage />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    const card = screen.getByTestId('card-1')
    await user.click(card)

    expect(screen.getByText('Detalles del Predio')).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('Residencial')).toBeInTheDocument()
  })

  it('should close details modal when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<PrediosPage />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    // Open details
    const card = screen.getByTestId('card-1')
    await user.click(card)

    // Close modal
    const closeButton = screen.getByText('Cerrar')
    await user.click(closeButton)

    expect(screen.queryByText('Detalles del Predio')).not.toBeInTheDocument()
  })

  it('should display complete predio details in modal', async () => {
    const user = userEvent.setup()
    render(<PrediosPage />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    const card = screen.getByTestId('card-1')
    await user.click(card)

    // Check all detail fields are displayed
    expect(screen.getByText('ID del Predio')).toBeInTheDocument()
    expect(screen.getByText('Tipo de Predio')).toBeInTheDocument()
    expect(screen.getByText('Fecha de Registro')).toBeInTheDocument()
    expect(screen.getByText('Información del Predio')).toBeInTheDocument()
    expect(screen.getByText('Dirección')).toBeInTheDocument()
    expect(screen.getByText('Teléfono')).toBeInTheDocument()
    expect(screen.getByText('Correo Electrónico')).toBeInTheDocument()
    expect(screen.getByText('Información del Propietario')).toBeInTheDocument()
    expect(screen.getByText('Nombre')).toBeInTheDocument()
    expect(screen.getByText('Cédula')).toBeInTheDocument()
  })

  it('should open edit form when edit button is clicked in details modal', async () => {
    const user = userEvent.setup()
    render(<PrediosPage />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    // Open details
    const card = screen.getByTestId('card-1')
    await user.click(card)

    // Click edit
    const editButton = screen.getByText('Editar')
    await user.click(editButton)

    expect(screen.getByTestId('form-predio')).toBeInTheDocument()
    expect(screen.getByText('Editing predio 1')).toBeInTheDocument()
  })

  it('should delete predio when delete button is clicked and confirmed', async () => {
    const user = userEvent.setup()
    deletePredio.mockResolvedValue({ message: 'Predio deleted successfully' })

    render(<PrediosPage />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    // Open details
    const card = screen.getByTestId('card-1')
    await user.click(card)

    // Click delete
    const deleteButton = screen.getByText('Eliminar')
    await user.click(deleteButton)

    await waitFor(() => {
      expect(deletePredio).toHaveBeenCalledWith(1)
      expect(toast.success).toHaveBeenCalledWith('Predio eliminado con éxito')
      expect(getPredios).toHaveBeenCalledTimes(2) // Reload after delete
    })
  })

  it('should handle delete error', async () => {
    const user = userEvent.setup()
    deletePredio.mockRejectedValue(new Error('Delete failed'))

    render(<PrediosPage />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    // Open details
    const card = screen.getByTestId('card-1')
    await user.click(card)

    // Click delete
    const deleteButton = screen.getByText('Eliminar')
    await user.click(deleteButton)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al eliminar el predio')
    })
  })

  it('should handle empty predios list', async () => {
    getPredios.mockResolvedValue([])

    render(<PrediosPage />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    expect(screen.getByText('No se encontraron predios')).toBeInTheDocument()
  })

  it('should be accessible with proper ARIA labels', async () => {
    render(<PrediosPage />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })

    const searchInput = screen.getByPlaceholderText(/Ej: Calle 123 o 1234567890 o Juan Pérez/)
    expect(searchInput).toBeInTheDocument()
  })
})
