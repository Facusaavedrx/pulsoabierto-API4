import styled from '@emotion/styled'
import { NavLink } from 'react-router-dom'
import { seleccionarCantidadFavoritos, useFavoritosStore } from '../store/favoritos'

const Barra = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 0;
  border-bottom: 1px solid #1f4566;
  flex-wrap: wrap;
  gap: 1rem;
`
const Marca = styled(NavLink)`
  color: #fff;
  font-weight: 900;
  font-size: 22px;
  text-decoration: none;
  span { color: #66a2fe; }
`
const Contador = styled.p`
  margin: 0;
  background-color: #1b3a57;
  padding: 6px 14px;
  border-radius: 999px;
  font-weight: 700;
`

function Encabezado () {
  // Dato derivado: se calcula desde la colección del store.
  const cantidad = useFavoritosStore(seleccionarCantidadFavoritos)

  return (
    <Barra>
      <Marca to='/'>Pulso <span>Abierto</span></Marca>
      <Contador aria-live='polite'>★ Favoritos: {cantidad}</Contador>
    </Barra>
  )
}

export default Encabezado
