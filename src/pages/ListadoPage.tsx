import { useState } from 'react'
import styled from '@emotion/styled'
import Spinner from '../components/Spinner'
import MensajeError from '../components/MensajeError'
import MensajeVacio from '../components/MensajeVacio'
import TarjetaCripto from '../components/TarjetaCripto'
import { BotonPrincipal, Heading } from '../components/Estilos'
import { useCotizaciones } from '../hooks/useCotizaciones'
import { seleccionarFavoritos, useFavoritosStore } from '../store/favoritos'
import ImagenCripto from '../assets/imagen-criptos.png'

const Contenedor = styled.div`
  @media (min-width: 992px) {
    display: grid;
    grid-template-columns: 1fr 1.3fr;
    column-gap: 2rem;
    align-items: start;
  }
`
const Imagen = styled.img`
  max-width: 400px;
  width: 80%;
  margin: 60px auto 0 auto;
  display: block;
`
const Label = styled.label`
  display: block;
  font-size: 20px;
  font-weight: 700;
  margin: 15px 0 8px;
`
const Input = styled.input`
  width: 100%;
  font-size: 18px;
  padding: 12px;
  border-radius: 10px;
  border: none;
`
const Ayuda = styled.p`
  margin: 8px 0 0;
  color: #ffb4ae;
  font-weight: 700;
`
const Check = styled.label`
  display: flex;
  align-items: center;
  gap: .5rem;
  margin-top: 14px;
  font-size: 17px;
`
const Lista = styled.ul`
  padding: 0;
  margin: 20px 0 0;
  display: grid;
  gap: 1rem;
`

/** Solo letras (con acentos), números y espacios; hasta 30 caracteres. */
const PATRON_BUSQUEDA = /^[\p{L}\p{N} ]{0,30}$/u
const MENSAJE_BUSQUEDA_INVALIDA = 'Usá solo letras, números o espacios (máximo 30 caracteres).'

function ListadoPage () {
  const { estado, volverAConsultar } = useCotizaciones()
  // Estado local del formulario controlado: solo lo usa esta página.
  const [busqueda, setBusqueda] = useState('')
  const [soloFavoritos, setSoloFavoritos] = useState(false)
  const favoritos = useFavoritosStore(seleccionarFavoritos)

  const cargando = estado.tipo === 'cargando'

  // Datos derivados: se calculan en cada render, no se guardan en estado.
  const busquedaValida = PATRON_BUSQUEDA.test(busqueda)
  const termino = busqueda.trim().toLowerCase()
  const visibles = estado.tipo === 'exito' && busquedaValida
    ? estado.datos.filter(c =>
      (c.nombre.toLowerCase().includes(termino) || c.simbolo.toLowerCase().includes(termino)) &&
      (!soloFavoritos || favoritos.includes(c.id)))
    : []

  return (
    <Contenedor>
      <Imagen src={ImagenCripto} alt='Imágenes de distintas criptomonedas' />
      <div>
        <Heading>Cotizaciones en vivo</Heading>

        <form onSubmit={e => { e.preventDefault(); volverAConsultar() }} role='search'>
          <Label htmlFor='busqueda'>Buscar criptomoneda</Label>
          <Input
            id='busqueda'
            type='search'
            placeholder='Ej.: Bitcoin o BTC'
            value={busqueda}
            onChange={e => setBusqueda(e.target.value)}
            aria-invalid={!busquedaValida}
            aria-describedby={busquedaValida ? undefined : 'error-busqueda'}
          />
          {!busquedaValida && <Ayuda id='error-busqueda' role='alert'>{MENSAJE_BUSQUEDA_INVALIDA}</Ayuda>}
          <Check>
            <input type='checkbox' checked={soloFavoritos} onChange={e => setSoloFavoritos(e.target.checked)} />
            Mostrar solo favoritos
          </Check>
          {/* Bloqueo temporal: no se puede iniciar otra consulta mientras hay una en curso. */}
          <BotonPrincipal type='submit' disabled={cargando}>
            {cargando ? 'Consultando…' : 'Actualizar cotizaciones'}
          </BotonPrincipal>
        </form>

        {estado.tipo === 'cargando' && <Spinner />}

        {estado.tipo === 'error' && <MensajeError mensaje={estado.mensaje} onReintentar={volverAConsultar} />}

        {estado.tipo === 'vacio' && (
          <MensajeVacio>La API no devolvió cotizaciones en este momento.</MensajeVacio>
        )}

        {estado.tipo === 'exito' && (
          <section aria-label='Resultados'>
            <p aria-live='polite'>Mostrando {visibles.length} de {estado.datos.length} criptomonedas</p>
            {visibles.length === 0
              ? <MensajeVacio>Ninguna criptomoneda coincide con el filtro.</MensajeVacio>
              : (
                <Lista>
                  {visibles.map(c => <TarjetaCripto key={c.id} cotizacion={c} />)}
                </Lista>
                )}
          </section>
        )}
      </div>
    </Contenedor>
  )
}

export default ListadoPage
