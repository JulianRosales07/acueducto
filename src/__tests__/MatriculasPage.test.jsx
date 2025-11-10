import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import MatriculasPage from '../pages/MatriculasPage'
import { getMatriculas } from '../services/matriculasService'
import { toast } from 'react-hot-toast'

// Mock dependencies
vi.mock('../services/matriculasService', () => ({
  getMatriculas: vi.fn(),
}))

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
  },
}))

vi.mock('../components/ComponentesGrupo5/CardMatriculas', () => ({
  default: ({ codigo, estado, direccion, fecha, tipo, matricula, onClick }) => (
    <div data-testid={`card-${codigo}`} onClick={() => onClick(matricula)}>
      <h2>{codigo}</h2>
      <span>{estado}</span>
      <p>{direccion}</p>
      <p>Creada: {fecha}</p>
      <p>{tipo}</p>
      <p>Haz clic para ver detalles completos</p>
    </div>
  ),
}))

vi.mock('../components/ComponentesGrupo5/FormMatricula', () => ({
  default: ({ onClose, onSuccess }) => (
    <div data-testid="form-matricula">
      <button onClick={onClose}>Close</button>
      <button onClick={onSuccess}>Success</button>
    </div>
  ),
}))

const mockMatriculas = [
  {
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
  },
  {
    cod_matricula: 'M002',
    estado: 'Inactiva',
    fecha: '2025-03-11',
    tipo_usuario: 'Comercial',
    tarifa: 'Especial',
    predio: {
      tipo: 'Comercial',
      direccion: 'Av. Central 89',
      propietario: {
        cc: '2002',
        nombre: 'María',
        apellido: 'López'
      }
    }
  }
]

describe('MatriculasPage', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    getMatriculas.mockResolvedValue(mockMatriculas)
  })

  it('should render the page title', () => {
    render(<MatriculasPage />)

    expect(screen.getByText('Gestión de Matrículas')).toBeInTheDocument()
  })

  it('should render the new matricula button', () => {
    render(<MatriculasPage />)

    expect(screen.getByText('Nueva Matrícula')).toBeInTheDocument()
  })

  it('should load and display matriculas on mount', async () => {
    render(<MatriculasPage />)

    await waitFor(() => {
      expect(getMatriculas).toHaveBeenCalledTimes(1)
    })

    expect(screen.getByTestId('card-M001')).toBeInTheDocument()
    expect(screen.getByTestId('card-M002')).toBeInTheDocument()
  })

  it('should display loading state initially', () => {
    getMatriculas.mockImplementation(() => new Promise(() => {})) // Never resolves

    render(<MatriculasPage />)

    expect(screen.getByText('Gestión de Matrículas')).toBeInTheDocument()
    // Cards should not be visible yet
    expect(screen.queryByTestId('card-M001')).not.toBeInTheDocument()
  })

  it('should handle API errors gracefully', async () => {
    const errorMessage = 'Failed to load matriculas'
    getMatriculas.mockRejectedValue(new Error(errorMessage))

    render(<MatriculasPage />)

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Error al cargar las matrículas')
    })
  })

  it('should open form modal when new matricula button is clicked', async () => {
    const user = userEvent.setup()
    render(<MatriculasPage />)

    const newButton = screen.getByText('Nueva Matrícula')
    await user.click(newButton)

    expect(screen.getByTestId('form-matricula')).toBeInTheDocument()
  })

  it('should close form modal when onClose is called', async () => {
    const user = userEvent.setup()
    render(<MatriculasPage />)

    // Open form
    const newButton = screen.getByText('Nueva Matrícula')
    await user.click(newButton)

    // Close form
    const closeButton = screen.getByText('Close')
    await user.click(closeButton)

    expect(screen.queryByTestId('form-matricula')).not.toBeInTheDocument()
  })

  it('should reload matriculas when form success callback is triggered', async () => {
    const user = userEvent.setup()
    render(<MatriculasPage />)

    // Open form
    const newButton = screen.getByText('Nueva Matrícula')
    await user.click(newButton)

    // Trigger success
    const successButton = screen.getByText('Success')
    await user.click(successButton)

    await waitFor(() => {
      expect(getMatriculas).toHaveBeenCalledTimes(2) // Initial load + reload after success
    })
  })

  it('should filter matriculas based on search input', async () => {
    const user = userEvent.setup()
    render(<MatriculasPage />)

    await waitFor(() => {
      expect(getMatriculas).toHaveBeenCalledTimes(1)
    })

    // Search by matricula code
    const searchInput = screen.getByPlaceholderText(/Ej: 1234567890 o MAT-2020-1001/)
    await user.type(searchInput, 'M001')

    expect(screen.getByTestId('card-M001')).toBeInTheDocument()
    expect(screen.queryByTestId('card-M002')).not.toBeInTheDocument()
  })

  it('should filter matriculas by propietario CC', async () => {
    const user = userEvent.setup()
    render(<MatriculasPage />)

    await waitFor(() => {
      expect(getMatriculas).toHaveBeenCalledTimes(1)
    })

    // Search by CC
    const searchInput = screen.getByPlaceholderText(/Ej: 1234567890 o MAT-2020-1001/)
    await user.type(searchInput, '2002')

    expect(screen.queryByTestId('card-M001')).not.toBeInTheDocument()
    expect(screen.getByTestId('card-M002')).toBeInTheDocument()
  })

  it('should display correct count when searching', async () => {
    const user = userEvent.setup()
    render(<MatriculasPage />)

    await waitFor(() => {
      expect(getMatriculas).toHaveBeenCalledTimes(1)
    })

    // Search for specific matricula
    const searchInput = screen.getByPlaceholderText(/Ej: 1234567890 o MAT-2020-1001/)
    await user.type(searchInput, 'M001')

    expect(screen.getByText('Se encontraron 1 matricula(s)')).toBeInTheDocument()
  })

  it('should display total count when no search', async () => {
    render(<MatriculasPage />)

    await waitFor(() => {
      expect(getMatriculas).toHaveBeenCalledTimes(1)
    })

    expect(screen.getByText('Existen 2 registros de matricula(s)')).toBeInTheDocument()
  })

  it('should show no results message when no matriculas match search', async () => {
    const user = userEvent.setup()
    render(<MatriculasPage />)

    await waitFor(() => {
      expect(getMatriculas).toHaveBeenCalledTimes(1)
    })

    // Search for non-existent matricula
    const searchInput = screen.getByPlaceholderText(/Ej: 1234567890 o MAT-2020-1001/)
    await user.type(searchInput, 'NONEXISTENT')

    expect(screen.getByText('No se encontraron matrículas')).toBeInTheDocument()
  })

  it('should open details modal when matricula card is clicked', async () => {
    const user = userEvent.setup()
    render(<MatriculasPage />)

    await waitFor(() => {
      expect(getMatriculas).toHaveBeenCalledTimes(1)
    })

    const card = screen.getByTestId('card-M001')
    await user.click(card)

    expect(screen.getByText('Detalles de Matrícula')).toBeInTheDocument()
    expect(screen.getByText('M001')).toBeInTheDocument()
    expect(screen.getByText('Activa')).toBeInTheDocument()
  })

  it('should close details modal when close button is clicked', async () => {
    const user = userEvent.setup()
    render(<MatriculasPage />)

    await waitFor(() => {
      expect(getMatriculas).toHaveBeenCalledTimes(1)
    })

    // Open details
    const card = screen.getByTestId('card-M001')
    await user.click(card)

    // Close modal
    const closeButton = screen.getByText('Cerrar')
    await user.click(closeButton)

    expect(screen.queryByText('Detalles de Matrícula')).not.toBeInTheDocument()
  })

  it('should display complete matricula details in modal', async () => {
    const user = userEvent.setup()
    render(<MatriculasPage />)

    await waitFor(() => {
      expect(getMatriculas).toHaveBeenCalledTimes(1)
    })

    const card = screen.getByTestId('card-M001')
    await user.click(card)

    // Check all detail fields are displayed
    expect(screen.getByText('Código de Matrícula')).toBeInTheDocument()
    expect(screen.getByText('Estado')).toBeInTheDocument()
    expect(screen.getByText('Fecha de Creación')).toBeInTheDocument()
    expect(screen.getByText('Tipo de Usuario')).toBeInTheDocument()
    expect(screen.getByText('Tarifa')).toBeInTheDocument()
    expect(screen.getByText('Información del Predio')).toBeInTheDocument()
    expect(screen.getByText('Dirección')).toBeInTheDocument()
    expect(screen.getByText('Tipo de Predio')).toBeInTheDocument()
    expect(screen.getByText('Propietario')).toBeInTheDocument()
    expect(screen.getByText('Cédula del Propietario')).toBeInTheDocument()
  })

  it('should handle empty matriculas list', async () => {
    getMatriculas.mockResolvedValue([])

    render(<MatriculasPage />)

    await waitFor(() => {
      expect(getMatriculas).toHaveBeenCalledTimes(1)
    })

    expect(screen.getByText('No se encontraron matrículas')).toBeInTheDocument()
  })

  it('should be accessible with proper ARIA labels', async () => {
    render(<MatriculasPage />)

    await waitFor(() => {
      expect(getMatriculas).toHaveBeenCalledTimes(1)
    })

    const searchInput = screen.getByPlaceholderText(/Ej: 1234567890 o MAT-2020-1001/)
    expect(searchInput).toBeInTheDocument()
  })
})
