import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getMatriculas, getMatricula, createMatricula, updateMatricula, deleteMatricula } from '../services/matriculasService'
import { api } from '../services/api'

vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('matriculasService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getMatriculas', () => {
    it('should fetch all matriculas successfully', async () => {
      const mockData = [
        {
          cod_matricula: 'M001',
          estado: 'Activa',
          fecha: '2025-03-06'
        }
      ]

      api.get.mockResolvedValue(mockData)

      const result = await getMatriculas()

      expect(api.get).toHaveBeenCalledWith('/matriculas')
      expect(result).toEqual(mockData)
    })
  })

  describe('getMatricula', () => {
    it('should fetch a specific matricula by code', async () => {
      const mockData = {
        cod_matricula: 'M001',
        estado: 'Activa'
      }

      api.get.mockResolvedValue(mockData)

      const result = await getMatricula('M001')

      expect(api.get).toHaveBeenCalledWith('/matriculas/M001')
      expect(result).toEqual(mockData)
    })
  })

  describe('updateMatricula', () => {
    it('should update an existing matricula successfully', async () => {
      const mockResponse = {
        cod_matricula: 'M001',
        estado: 'Inactiva'
      }

      api.put.mockResolvedValue(mockResponse)

      const result = await updateMatricula('M001', { estado: 'Inactiva' })

      expect(api.put).toHaveBeenCalledWith('/matriculas/M001', { estado: 'Inactiva' })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deleteMatricula', () => {
    it('should delete a matricula successfully', async () => {
      const mockResponse = { message: 'Matricula deleted successfully' }

      api.delete.mockResolvedValue(mockResponse)

      const result = await deleteMatricula('M001')

      expect(api.delete).toHaveBeenCalledWith('/matriculas/M001')
      expect(result).toEqual(mockResponse)
    })
  })
})
