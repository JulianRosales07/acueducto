import { describe, it, expect, vi, beforeEach } from 'vitest';
import { api } from '../services/api';
import {
  getPropietarios,
  getPropietario,
  createPropietario,
  updatePropietario,
  deletePropietario
} from '../services/propietariosService';

// Mock de la API
vi.mock('../services/api', () => ({
  api: {
    get: vi.fn(),
    post: vi.fn(),
    put: vi.fn(),
    delete: vi.fn()
  }
}));

describe('propietariosService', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('getPropietarios', () => {
    it('debe obtener la lista de propietarios correctamente', async () => {
      const mockResponse = [
        { cc: '1234567890', nombre: 'Juan', apellido: 'Pérez' },
        { cc: '0987654321', nombre: 'María', apellido: 'García' }
      ];

      api.get.mockResolvedValue(mockResponse);

      const result = await getPropietarios();

      expect(api.get).toHaveBeenCalledWith('/propietarios');
      expect(result).toEqual(mockResponse);
    });

    it('debe manejar errores al obtener propietarios', async () => {
      const errorMessage = 'Error de red';
      api.get.mockRejectedValue(new Error(errorMessage));

      await expect(getPropietarios()).rejects.toThrow(errorMessage);
    });
  });

  describe('getPropietario', () => {
    it('debe obtener un propietario por cédula correctamente', async () => {
      const mockResponse = { cc: '1234567890', nombre: 'Juan', apellido: 'Pérez' };
      const cc = '1234567890';

      api.get.mockResolvedValue(mockResponse);

      const result = await getPropietario(cc);

      expect(api.get).toHaveBeenCalledWith(`/propietarios/${cc}`);
      expect(result).toEqual(mockResponse);
    });

    it('debe manejar errores al obtener un propietario', async () => {
      const errorMessage = 'Propietario no encontrado';
      api.get.mockRejectedValue(new Error(errorMessage));

      await expect(getPropietario('1234567890')).rejects.toThrow(errorMessage);
    });
  });

  describe('createPropietario', () => {
    it('debe crear un propietario correctamente', async () => {
      const propietarioData = {
        cc: '1234567890',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '3001234567',
        correo: 'juan@email.com'
      };
      const mockResponse = { ...propietarioData, id: 1 };

      // Mock para getPropietarios (lista vacía para permitir creación)
      api.get.mockResolvedValue([]);
      api.post.mockResolvedValue(mockResponse);

      const result = await createPropietario(propietarioData);

      expect(api.get).toHaveBeenCalledWith('/propietarios');
      expect(api.post).toHaveBeenCalledWith('/propietarios', propietarioData);
      expect(result).toEqual(mockResponse);
    });

    it('debe rechazar la creación si ya existe un propietario con la misma cédula', async () => {
      const propietarioData = {
        cc: '1234567890',
        nombre: 'Juan',
        apellido: 'Pérez',
        telefono: '3001234567',
        correo: 'juan@email.com'
      };

      // Mock para getPropietarios (retorna propietario existente)
      api.get.mockResolvedValue([{ cc: '1234567890', nombre: 'Juan', apellido: 'Pérez' }]);

      await expect(createPropietario(propietarioData)).rejects.toThrow('Ya existe un propietario con esta cédula');
      expect(api.post).not.toHaveBeenCalled();
    });

    it('debe manejar errores al crear un propietario', async () => {
      const errorMessage = 'Error al crear propietario';

      // Mock para getPropietarios (lista vacía)
      api.get.mockResolvedValue([]);
      api.post.mockRejectedValue(new Error(errorMessage));

      await expect(createPropietario({})).rejects.toThrow(errorMessage);
    });
  });

  describe('updatePropietario', () => {
    it('debe actualizar un propietario correctamente', async () => {
      const cc = '1234567890';
      const propietarioData = {
        nombre: 'Juan Carlos',
        apellido: 'Pérez',
        telefono: '3001234567',
        correo: 'juancarlos@email.com'
      };
      const mockResponse = { cc, ...propietarioData };

      api.put.mockResolvedValue(mockResponse);

      const result = await updatePropietario(cc, propietarioData);

      expect(api.put).toHaveBeenCalledWith(`/propietarios/${cc}`, propietarioData);
      expect(result).toEqual(mockResponse);
    });

    it('debe manejar errores al actualizar un propietario', async () => {
      const errorMessage = 'Error al actualizar propietario';
      api.put.mockRejectedValue(new Error(errorMessage));

      await expect(updatePropietario('1234567890', {})).rejects.toThrow(errorMessage);
    });
  });

  describe('deletePropietario', () => {
    it('debe eliminar un propietario correctamente', async () => {
      const cc = '1234567890';
      const mockResponse = { message: 'Propietario eliminado' };

      api.delete.mockResolvedValue(mockResponse);

      const result = await deletePropietario(cc);

      expect(api.delete).toHaveBeenCalledWith(`/propietarios/${cc}`);
      expect(result).toEqual(mockResponse);
    });

    it('debe manejar errores al eliminar un propietario', async () => {
      const errorMessage = 'Error al eliminar propietario';
      api.delete.mockRejectedValue(new Error(errorMessage));

      await expect(deletePropietario('1234567890')).rejects.toThrow(errorMessage);
    });
  });
});
