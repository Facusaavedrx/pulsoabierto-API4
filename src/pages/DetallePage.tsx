import styled from '@emotion/styled'
import { Link, useParams } from 'react-router-dom'
import BotonFavorito from '../components/BotonFavorito'
import MensajeError from '../components/MensajeError'
import MensajeVacio from '../components/MensajeVacio'
import Spinner from '../components/Spinner'
import { Heading } from '../components/Estilos'
import { esCriptoId } from '../data/criptos'
import { useCotizaciones } from '../hooks/useCotizaciones'
import { formatearUsd } from '../utils/formato'

const Panel = styled.article`
  max-width: 600px;
  margin: 0 auto;
  background-color: #14304a;
  border-radius: 12px;
  padding: 24px;
`
const Precio = styled.p`
  font-size: 32px;
  font-weight: 900;
  margin: 10px 0 20px;
`

function DetallePage () {
  const { id } = useParams()
  const { estado, volverAConsultar } = useCotizaciones()

  if (!esCriptoId(id)) {
    return (
      <>
        <Heading>Criptomoneda no encontrada</Heading>
        <MensajeVacio>No conocemos la criptomoneda "{id}".</MensajeVacio>
        <Link to='/'>Volver al listado</Link>
      </>
    )
  }

  const cotizacion = estado.tipo === 'exito' ? estado.datos.find(c => c.id === id) : undefined

  return (
    <>
      <Heading>Detalle</Heading>
      <p><Link to='/'>← Volver al listado</Link></p>

      {estado.tipo === 'cargando' && <Spinner />}
      {estado.tipo === 'error' && <MensajeError mensaje={estado.mensaje} onReintentar={volverAConsultar} />}
      {(estado.tipo === 'vacio' || (estado.tipo === 'exito' && !cotizacion)) && (
        <MensajeVacio>No hay datos disponibles para esta criptomoneda.</MensajeVacio>
      )}

      {cotizacion && (
        <Panel aria-labelledby='titulo-detalle'>
          <h2 id='titulo-detalle' style={{ margin: 0 }}>{cotizacion.nombre} ({cotizacion.simbolo})</h2>
          <Precio>{formatearUsd(cotizacion.precioUsd)}</Precio>
          <p>{cotizacion.descripcion}</p>
          <BotonFavorito id={cotizacion.id} nombre={cotizacion.nombre} />
        </Panel>
      )}
    </>
  )
}

export default DetallePage
