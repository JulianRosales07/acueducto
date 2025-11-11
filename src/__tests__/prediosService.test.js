import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getPredios, getPredio, createPredio, updatePredio, deletePredio } from '../services/prediosService'
import { api } from '../services/api'

vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn(),
  },
}))

describe('prediosService', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('getPredios', () => {
    it('should fetch all predios successfully', async () => {
      const mockData = [
        {
          id: 1,
          direccion: 'Calle 12 #4-56',
          tipo: 'Residencial'
        }
      ]

      api.get.mockResolvedValue(mockData)

      const result = await getPredios()

      expect(api.get).toHaveBeenCalledWith('/predios')
      expect(result).toEqual(mockData)
    })
  })

  describe('getPredio', () => {
    it('should fetch a specific predio by id', async () => {
      const mockData = {
        id: 1,
        direccion: 'Calle 12 #4-56',
        tipo: 'Residencial'
      }

      api.get.mockResolvedValue(mockData)

      const result = await getPredio(1)

      expect(api.get).toHaveBeenCalledWith('/predios/1')
      expect(result).toEqual(mockData)
    })
  })

  describe('updatePredio', () => {
    it('should update an existing predio successfully', async () => {
      const mockResponse = {
        id: 1,
        direccion: 'Nueva Calle 123'
      }

      api.put.mockResolvedValue(mockResponse)

      const result = await updatePredio(1, { direccion: 'Nueva Calle 123' })

      expect(api.put).toHaveBeenCalledWith('/predios/1', { direccion: 'Nueva Calle 123' })
      expect(result).toEqual(mockResponse)
    })
  })

  describe('deletePredio', () => {
    it('should delete a predio successfully', async () => {
      const mockResponse = { message: 'Predio deleted successfully' }

      api.delete.mockResolvedValue(mockResponse)

      const result = await deletePredio(1)

      expect(api.delete).toHaveBeenCalledWith('/predios/1')
      expect(result).toEqual(mockResponse)
    })
  })
})
