import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import CardMatriculas from '../components/ComponentesGrupo5/CardMatriculas'

describe('CardMatriculas', () => {
  const mockMatricula = {
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

  it('debe renderizar sin errores', () => {
    const { container } = render(
      <CardMatriculas
        matricula={mockMatricula}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(container).toBeTruthy()
  })
})
