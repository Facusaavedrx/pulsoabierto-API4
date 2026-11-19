import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { CriptoId } from '../types/cripto'

export interface FavoritosState {
  favoritos: CriptoId[]
  alternarFavorito: (id: CriptoId) => void
}

export const CLAVE_PERSISTENCIA = 'pulso-abierto-favoritos'

export const useFavoritosStore = create<FavoritosState>()(
  persist(
    set => ({
      favoritos: [],
      // Actualización inmutable: siempre se crea un arreglo nuevo.
      alternarFavorito: id =>
        set(estado => ({
          favoritos: estado.favoritos.includes(id)
            ? estado.favoritos.filter(favorito => favorito !== id)
            : [...estado.favoritos, id]
        }))
    }),
    {
      name: CLAVE_PERSISTENCIA,
      storage: createJSONStorage(() => localStorage),
      // Solo se guarda la colección de favoritos.
      partialize: estado => ({ favoritos: estado.favoritos })
    }
  )
)

/* ---------- Selectores: cada componente pide solo lo que necesita ---------- */

export const seleccionarEsFavorito = (id: CriptoId) => (estado: FavoritosState) =>
  estado.favoritos.includes(id)

export const seleccionarAlternarFavorito = (estado: FavoritosState) => estado.alternarFavorito

/** Dato derivado: la cantidad se calcula, no se almacena. */
export const seleccionarCantidadFavoritos = (estado: FavoritosState) => estado.favoritos.length

export const seleccionarFavoritos = (estado: FavoritosState) => estado.favoritos
