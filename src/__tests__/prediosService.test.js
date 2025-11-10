import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getPredios, getPredio, createPredio, updatePredio, deletePredio } from '../services/prediosService'
import { api } from '../services/api'

// Mock the api module
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
          tipo: 'Residencial',
          telefono: '3001234567',
          correo: 'propietario@email.com',
          fecha_registro: '2025-03-06',
          propietario: {
            cc: '2001',
            nombre: 'Carlos Muñoz'
          }
        }
      ]

      api.get.mockResolvedValue(mockData)

      const result = await getPredios()

      expect(api.get).toHaveBeenCalledWith('/predios')
      expect(result).toEqual(mockData)
    })

    it('should handle API errors', async () => {
      const errorMessage = 'Network Error'
      api.get.mockRejectedValue(new Error(errorMessage))

      await expect(getPredios()).rejects.toThrow(errorMessage)
    })
  })

  describe('getPredio', () => {
    it('should fetch a specific predio by id', async () => {
      const mockData = {
        id: 1,
        direccion: 'Calle 12 #4-56',
        tipo: 'Residencial',
        telefono: '3001234567',
        correo: 'propietario@email.com',
        fecha_registro: '2025-03-06'
      }
      const id = 1

      api.get.mockResolvedValue(mockData)

      const result = await getPredio(id)

      expect(api.get).toHaveBeenCalledWith(`/predios/${id}`)
      expect(result).toEqual(mockData)
    })

    it('should handle API errors when fetching specific predio', async () => {
      const errorMessage = 'Predio not found'
      api.get.mockRejectedValue(new Error(errorMessage))

      await expect(getPredio(999)).rejects.toThrow(errorMessage)
    })
  })

  describe('createPredio', () => {
    it('should create a new predio successfully', async () => {
      const newPredioData = {
        direccion: 'Calle 45 #6-78',
        id_propietario: '2001',
        telefono: '3009876543',
        correo: 'nuevo@email.com',
        tipo: 'Comercial'
      }
      const mockResponse = {
        id: 2,
        ...newPredioData,
        fecha_registro: '2025-11-04'
      }

      // Mock para getPredios (lista vacía para permitir creación)
      api.get.mockResolvedValue([]);
      api.post.mockResolvedValue(mockResponse);

      const result = await createPredio(newPredioData);

      expect(api.get).toHaveBeenCalledWith('/predios');
      expect(api.post).toHaveBeenCalledWith('/predios', newPredioData);
      expect(result).toEqual(mockResponse);
    });

    it('should reject creation if predio with same address and owner already exists', async () => {
      const newPredioData = {
        direccion: 'Calle 45 #6-78',
        id_propietario: '2001',
        telefono: '3009876543',
        correo: 'nuevo@email.com',
        tipo: 'Comercial'
      };

      // Mock para getPredios (retorna predio existente con misma dirección y propietario)
      api.get.mockResolvedValue([
        {
          id: 1,
          direccion: 'Calle 45 #6-78',
          id_propietario: '2001',
          telefono: '3001234567',
          correo: 'existente@email.com',
          tipo: 'Residencial'
        }
      ]);

      await expect(createPredio(newPredioData)).rejects.toThrow('Ya existe un predio con esta dirección para este propietario');
      expect(api.post).not.toHaveBeenCalled();
    });

    it('should handle validation errors during creation', async () => {
      const invalidData = {};
      const errorMessage = 'Validation Error';

      // Mock para getPredios (lista vacía)
      api.get.mockResolvedValue([]);
      api.post.mockRejectedValue(new Error(errorMessage));

      await expect(createPredio(invalidData)).rejects.toThrow(errorMessage);
    });
  });

  describe('updatePredio', () => {
    it('should update an existing predio successfully', async () => {
      const id = 1
      const updateData = {
        direccion: 'Nueva Calle 123',
        telefono: '3012345678'
      }
      const mockResponse = {
        id: id,
        direccion: 'Nueva Calle 123',
        telefono: '3012345678',
        tipo: 'Residencial'
      }

      api.put.mockResolvedValue(mockResponse)

      const result = await updatePredio(id, updateData)

      expect(api.put).toHaveBeenCalledWith(`/predios/${id}`, updateData)
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors when updating non-existent predio', async () => {
      const errorMessage = 'Predio not found'
      api.put.mockRejectedValue(new Error(errorMessage))

      await expect(updatePredio(999, { direccion: 'Nueva dirección' })).rejects.toThrow(errorMessage)
    })
  })

  describe('deletePredio', () => {
    it('should delete a predio successfully', async () => {
      const id = 1
      const mockResponse = { message: 'Predio deleted successfully' }

      api.delete.mockResolvedValue(mockResponse)

      const result = await deletePredio(id)

      expect(api.delete).toHaveBeenCalledWith(`/predios/${id}`)
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors when deleting non-existent predio', async () => {
      const errorMessage = 'Predio not found'
      api.delete.mockRejectedValue(new Error(errorMessage))

      await expect(deletePredio(999)).rejects.toThrow(errorMessage)
    })
  })
})
