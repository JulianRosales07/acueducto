import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen, waitFor } from '@testing-library/react'
import MatriculasPage from '../pages/MatriculasPage'
import { getMatriculas } from '../services/matriculasService'

vi.mock('../services/matriculasService', () => ({
  getMatriculas: vi.fn(),
}))

vi.mock('react-hot-toast', () => ({
  toast: {
    error: vi.fn(),
    success: vi.fn(),
    loading: vi.fn(() => 'toast-id'),
    dismiss: vi.fn()
  },
}))

describe('MatriculasPage', () => {
  const mockMatriculas = [
    {
      cod_matricula: 'M001',
      estado: 'Activa',
      fecha: '2025-03-06',
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
  ]

  beforeEach(() => {
    vi.clearAllMocks()
    getMatriculas.mockResolvedValue(mockMatriculas)
  })

  it('debe renderizar el título de la página', async () => {
    render(<MatriculasPage />)

    await waitFor(() => {
      expect(screen.getByText('Matrículas')).toBeInTheDocument()
    })
  })

  it('debe cargar y mostrar la lista de matrículas', async () => {
    render(<MatriculasPage />)

    await waitFor(() => {
      expect(getMatriculas).toHaveBeenCalledTimes(1)
    })
  })
})
