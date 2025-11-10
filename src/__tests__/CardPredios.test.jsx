import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import CardPredios from '../components/ComponentesGrupo5/CardPredios'

describe('CardPredios', () => {
  const mockPredio = {
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

  it('debe renderizar sin errores', () => {
    const { container } = render(
      <CardPredios
        predio={mockPredio}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(container).toBeTruthy()
  })
})
