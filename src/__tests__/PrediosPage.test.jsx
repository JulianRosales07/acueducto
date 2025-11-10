import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import PrediosPage from '../pages/PrediosPage'
import { getPredios } from '../services/prediosService'

vi.mock('../services/prediosService', () => ({
  getPredios: vi.fn(),
  deletePredio: vi.fn(),
}))

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    loading: vi.fn(() => 'toast-id'),
    dismiss: vi.fn()
  },
}))

describe('PrediosPage', () => {
  const mockPredios = [
    {
      id: 1,
      direccion: 'Calle 12 #4-56',
      tipo: 'Residencial',
      telefono: '3001234567',
      correo: 'propietario@email.com',
      fecha_registro: '2025-03-06',
      propietario: {
        cc: '2001',
        nombre: 'Carlos',
        apellido: 'Muñoz'
      }
    }
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    getPredios.mockResolvedValue(mockPredios)
  })

  it('debe renderizar el título de la página', async () => {
    render(<PrediosPage />)

    await waitFor(() => {
      expect(screen.getByText('Predios')).toBeInTheDocument()
    })
  })

  it('debe cargar y mostrar la lista de predios', async () => {
    render(<PrediosPage />)

    await waitFor(() => {
      expect(getPredios).toHaveBeenCalledTimes(1)
    })
  })
})
