import { beforeEach, describe, expect, it } from 'vitest'
import { CLAVE_PERSISTENCIA, seleccionarCantidadFavoritos, useFavoritosStore } from './favoritos'

describe('Store de favoritos', () => {
  beforeEach(() => {
    useFavoritosStore.setState({ favoritos: [] })
  })

  it('alterna un favorito sin mutar el arreglo anterior', () => {
    const antes = useFavoritosStore.getState().favoritos
    useFavoritosStore.getState().alternarFavorito('bitcoin')
    const despues = useFavoritosStore.getState().favoritos

    expect(despues).toEqual(['bitcoin'])
    expect(despues).not.toBe(antes)
    expect(antes).toEqual([])

    useFavoritosStore.getState().alternarFavorito('bitcoin')
    expect(useFavoritosStore.getState().favoritos).toEqual([])
  })

  it('la cantidad se deriva de la colección', () => {
    useFavoritosStore.getState().alternarFavorito('bitcoin')
    useFavoritosStore.getState().alternarFavorito('solana')
    expect(seleccionarCantidadFavoritos(useFavoritosStore.getState())).toBe(2)
  })

  it('persiste solamente la colección de favoritos en localStorage', () => {
    useFavoritosStore.getState().alternarFavorito('ethereum')

    const guardado = JSON.parse(localStorage.getItem(CLAVE_PERSISTENCIA) ?? '{}')
    expect(guardado.state).toEqual({ favoritos: ['ethereum'] })
  })
})
