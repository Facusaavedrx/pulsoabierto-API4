import styled from '@emotion/styled'
import { seleccionarAlternarFavorito, seleccionarEsFavorito, useFavoritosStore } from '../store/favoritos'
import type { CriptoId } from '../types/cripto'

const Boton = styled.button<{ activo: boolean }>`
  background-color: ${p => (p.activo ? '#ffd166' : 'transparent')};
  color: ${p => (p.activo ? '#0d2235' : '#ffd166')};
  border: 2px solid #ffd166;
  border-radius: 999px;
  padding: 6px 14px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: background-color .2s ease;
`

interface Props {
  id: CriptoId
  nombre: string
}

function BotonFavorito ({ id, nombre }: Props) {
  // Selectores: el botón solo se suscribe a si ESTA cripto es favorita.
  const esFavorito = useFavoritosStore(seleccionarEsFavorito(id))
  const alternarFavorito = useFavoritosStore(seleccionarAlternarFavorito)

  return (
    <Boton
      type='button'
      activo={esFavorito}
      aria-pressed={esFavorito}
      aria-label={esFavorito ? `Quitar ${nombre} de favoritos` : `Marcar ${nombre} como favorito`}
      onClick={() => alternarFavorito(id)}
    >
      <span aria-hidden='true'>{esFavorito ? '★' : '☆'}</span> {esFavorito ? 'Favorito' : 'Marcar favorito'}
    </Boton>
  )
}

export default BotonFavorito
