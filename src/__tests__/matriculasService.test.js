import { describe, it, expect, vi, beforeEach } from 'vitest'
import { getMatriculas, getMatricula, createMatricula, updateMatricula, deleteMatricula } from '../services/matriculasService'
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

      api.get.mockResolvedValue(mockData)

      const result = await getMatriculas()

      expect(api.get).toHaveBeenCalledWith('/matriculas')
      expect(result).toEqual(mockData)
    })

    it('should handle API errors', async () => {
      const errorMessage = 'Network Error'
      api.get.mockRejectedValue(new Error(errorMessage))

      await expect(getMatriculas()).rejects.toThrow(errorMessage)
    })
  })

  describe('getMatricula', () => {
    it('should fetch a specific matricula by code', async () => {
      const mockData = {
        cod_matricula: 'M001',
        estado: 'Activa',
        fecha: '2025-03-06'
      }
      const cod = 'M001'

      api.get.mockResolvedValue(mockData)

      const result = await getMatricula(cod)

      expect(api.get).toHaveBeenCalledWith(`/matriculas/${cod}`)
      expect(result).toEqual(mockData)
    })

    it('should handle API errors when fetching specific matricula', async () => {
      const errorMessage = 'Matricula not found'
      api.get.mockRejectedValue(new Error(errorMessage))

      await expect(getMatricula('M999')).rejects.toThrow(errorMessage)
    })
  })

  describe('createMatricula', () => {
    it('should create a new matricula successfully', async () => {
      const newMatriculaData = {
        id_predio: 1,
        estado: 'Activa',
        tipo_usuario: 'Residencial',
        tarifa: 'Basica'
      }
      const mockResponse = {
        cod_matricula: 'M003',
        ...newMatriculaData,
        fecha: '2025-11-04'
      }

      // Mock para getMatriculas (lista vacía para permitir creación)
      api.get.mockResolvedValue([]);
      api.post.mockResolvedValue(mockResponse);

      const result = await createMatricula(newMatriculaData);

      expect(api.get).toHaveBeenCalledWith('/matriculas');
      expect(api.post).toHaveBeenCalledWith('/matriculas', newMatriculaData);
      expect(result).toEqual(mockResponse);
    });

    it('should reject creation if matricula for same predio already exists', async () => {
      const newMatriculaData = {
        id_predio: 1,
        estado: 'Activa',
        tipo_usuario: 'Residencial',
        tarifa: 'Basica'
      };

      // Mock para getMatriculas (retorna matricula existente para el mismo predio)
      api.get.mockResolvedValue([
        {
          cod_matricula: 'M001',
          id_predio: 1,
          estado: 'Activa',
          tipo_usuario: 'Residencial',
          tarifa: 'Basica'
        }
      ]);

      await expect(createMatricula(newMatriculaData)).rejects.toThrow('Ya existe una matrícula para este predio');
      expect(api.post).not.toHaveBeenCalled();
    });

    it('should handle validation errors during creation', async () => {
      const invalidData = {};
      const errorMessage = 'Validation Error';

      // Mock para getMatriculas (lista vacía)
      api.get.mockResolvedValue([]);
      api.post.mockRejectedValue(new Error(errorMessage));

      await expect(createMatricula(invalidData)).rejects.toThrow(errorMessage);
    });
  });

  describe('updateMatricula', () => {
    it('should update an existing matricula successfully', async () => {
      const cod = 'M001'
      const updateData = {
        estado: 'Inactiva',
        tipo_usuario: 'Comercial'
      }
      const mockResponse = {
        cod_matricula: cod,
        estado: 'Inactiva',
        tipo_usuario: 'Comercial'
      }

      api.put.mockResolvedValue(mockResponse)

      const result = await updateMatricula(cod, updateData)

      expect(api.put).toHaveBeenCalledWith(`/matriculas/${cod}`, updateData)
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors when updating non-existent matricula', async () => {
      const errorMessage = 'Matricula not found'
      api.put.mockRejectedValue(new Error(errorMessage))

      await expect(updateMatricula('M999', { estado: 'Activa' })).rejects.toThrow(errorMessage)
    })
  })

  describe('deleteMatricula', () => {
    it('should delete a matricula successfully', async () => {
      const cod = 'M001'
      const mockResponse = { message: 'Matricula deleted successfully' }

      api.delete.mockResolvedValue(mockResponse)

      const result = await deleteMatricula(cod)

      expect(api.delete).toHaveBeenCalledWith(`/matriculas/${cod}`)
      expect(result).toEqual(mockResponse)
    })

    it('should handle errors when deleting non-existent matricula', async () => {
      const errorMessage = 'Matricula not found'
      api.delete.mockRejectedValue(new Error(errorMessage))

      await expect(deleteMatricula('M999')).rejects.toThrow(errorMessage)
    })
  })
})
