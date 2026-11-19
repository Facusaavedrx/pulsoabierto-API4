import { useState } from 'react'
import styled from '@emotion/styled'
import { Link } from 'react-router-dom'
import BotonFavorito from './BotonFavorito'
import { formatearUsd } from '../utils/formato'
import type { Cotizacion } from '../types/cripto'

const Tarjeta = styled.li`
  background-color: #14304a;
  border-radius: 12px;
  padding: 18px 20px;
  list-style: none;
`
const Fila = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 1rem;
  flex-wrap: wrap;
`
const Nombre = styled.h3`
  margin: 0;
  font-size: 22px;
`
const Precio = styled.p`
  font-size: 24px;
  font-weight: 700;
  margin: 8px 0;
`
const BotonTexto = styled.button`
  background: none;
  border: none;
  color: #66a2fe;
  font-size: 15px;
  padding: 0;
  cursor: pointer;
  text-decoration: underline;
`

function TarjetaCripto ({ cotizacion }: { cotizacion: Cotizacion }) {
  // Estado local: abrir/cerrar la información solo le importa a esta tarjeta.
  const [abierta, setAbierta] = useState(false)
  const idPanel = `info-${cotizacion.id}`

  return (
    <Tarjeta>
      <Fila>
        <Nombre>{cotizacion.nombre} <small>({cotizacion.simbolo})</small></Nombre>
        <BotonFavorito id={cotizacion.id} nombre={cotizacion.nombre} />
      </Fila>
      <Precio>{formatearUsd(cotizacion.precioUsd)}</Precio>
      <Fila>
        <BotonTexto type='button' aria-expanded={abierta} aria-controls={idPanel} onClick={() => setAbierta(a => !a)}>
          {abierta ? 'Ocultar información' : 'Ver información'}
        </BotonTexto>
        <Link to={`/cripto/${cotizacion.id}`}>Ir al detalle de {cotizacion.nombre}</Link>
      </Fila>
      {abierta && <p id={idPanel}>{cotizacion.descripcion}</p>}
    </Tarjeta>
  )
}

export default TarjetaCripto
