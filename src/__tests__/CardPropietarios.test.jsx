import { describe, it, expect, vi } from 'vitest'
import { render } from '@testing-library/react'
import CardPropietarios from '../components/ComponentesGrupo5/CardPropietarios'

describe('CardPropietarios', () => {
  const mockPropietario = {
    cc: '1234567890',
    nombre: 'Juan',
    apellido: 'Pérez',
    telefono: '3001234567',
    correo: 'juan@email.com'
  }

  it('debe renderizar sin errores', () => {
    const { container } = render(
      <CardPropietarios
        propietario={mockPropietario}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />
    )

    expect(container).toBeTruthy()
  })
})
