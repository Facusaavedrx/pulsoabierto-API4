import { beforeEach, describe, expect, it } from 'vitest'
import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { useFavoritosStore } from '../store/favoritos'
import { RESPUESTA_OK, renderizarApp, respuestaFalsa, simularFetch } from '../test/utilidades'

beforeEach(() => {
  useFavoritosStore.setState({ favoritos: [] })
})

describe('A. Favoritos', () => {
  it('una persona puede marcar y desmarcar una criptomoneda y la interfaz lo refleja', async () => {
    simularFetch().mockResolvedValue(respuestaFalsa(RESPUESTA_OK))
    const usuario = userEvent.setup()
    renderizarApp('/')

    const marcar = await screen.findByRole('button', { name: 'Marcar Bitcoin como favorito' })
    expect(marcar).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('★ Favoritos: 0')).toBeInTheDocument()

    await usuario.click(marcar)

    const quitar = screen.getByRole('button', { name: 'Quitar Bitcoin de favoritos' })
    expect(quitar).toHaveAttribute('aria-pressed', 'true')
    expect(screen.getByText('★ Favoritos: 1')).toBeInTheDocument()

    await usuario.click(quitar)

    expect(screen.getByRole('button', { name: 'Marcar Bitcoin como favorito' })).toHaveAttribute('aria-pressed', 'false')
    expect(screen.getByText('★ Favoritos: 0')).toBeInTheDocument()
  })

  it('el favorito marcado en el listado aparece marcado en la página de detalle', async () => {
    simularFetch().mockImplementation(async () => respuestaFalsa(RESPUESTA_OK))
    const usuario = userEvent.setup()
    renderizarApp('/')

    await usuario.click(await screen.findByRole('button', { name: 'Marcar Solana como favorito' }))
    await usuario.click(screen.getByRole('link', { name: 'Ir al detalle de Solana' }))

    const detalle = await screen.findByRole('article', { name: 'Solana (SOL)' })
    const boton = within(detalle).getByRole('button', { name: 'Quitar Solana de favoritos' })
    expect(boton).toHaveAttribute('aria-pressed', 'true')

    // Y desde el detalle se puede desmarcar
    await usuario.click(boton)
    expect(within(detalle).getByRole('button', { name: 'Marcar Solana como favorito' })).toBeInTheDocument()
    expect(screen.getByText('★ Favoritos: 0')).toBeInTheDocument()
  })
})

describe('B. Consulta de datos', () => {
  it('muestra la carga y luego el resultado exitoso', async () => {
    simularFetch().mockResolvedValue(respuestaFalsa(RESPUESTA_OK))
    renderizarApp('/')

    expect(screen.getByRole('status')).toHaveTextContent('Cargando cotizaciones')
    expect(screen.getByRole('button', { name: 'Consultando…' })).toBeDisabled()

    expect(await screen.findByRole('heading', { name: /Bitcoin/ })).toBeInTheDocument()
    expect(screen.getByText('Mostrando 3 de 3 criptomonedas')).toBeInTheDocument()
    expect(screen.queryByText(/Cargando cotizaciones/)).not.toBeInTheDocument()
  })

  it('si la API no trae datos muestra el mensaje de ausencia de datos', async () => {
    simularFetch().mockResolvedValue(respuestaFalsa({}))
    renderizarApp('/')

    expect(await screen.findByText('La API no devolvió cotizaciones en este momento.')).toBeInTheDocument()
  })

  it('el filtro de búsqueda reduce los resultados visibles', async () => {
    simularFetch().mockResolvedValue(respuestaFalsa(RESPUESTA_OK))
    const usuario = userEvent.setup()
    renderizarApp('/')

    await screen.findByText('Mostrando 3 de 3 criptomonedas')
    await usuario.type(screen.getByLabelText('Buscar criptomoneda'), 'eth')

    expect(screen.getByText('Mostrando 1 de 3 criptomonedas')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /Ethereum/ })).toBeInTheDocument()
    expect(screen.queryByRole('heading', { name: /Bitcoin/ })).not.toBeInTheDocument()
  })
})

describe('Validación del formulario', () => {
  it('rechaza caracteres no permitidos, muestra el error y se recupera al corregir', async () => {
    simularFetch().mockResolvedValue(respuestaFalsa(RESPUESTA_OK))
    const usuario = userEvent.setup()
    renderizarApp('/')

    await screen.findByText('Mostrando 3 de 3 criptomonedas')
    const campo = screen.getByLabelText('Buscar criptomoneda')
    expect(campo).toHaveAttribute('aria-invalid', 'false')

    await usuario.type(campo, 'btc$')

    expect(campo).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Usá solo letras, números o espacios (máximo 30 caracteres).')).toBeInTheDocument()
    expect(screen.getByText('Mostrando 0 de 3 criptomonedas')).toBeInTheDocument()

    await usuario.type(campo, '{Backspace}')

    expect(campo).toHaveAttribute('aria-invalid', 'false')
    expect(screen.queryByText(/Usá solo letras/)).not.toBeInTheDocument()
    expect(screen.getByText('Mostrando 1 de 3 criptomonedas')).toBeInTheDocument()
  })
})

describe('Consulta vigente', () => {
  it('cancela la solicitud en curso cuando la vista se desmonta', () => {
    let senal: AbortSignal | undefined
    simularFetch().mockImplementation((_url, opciones) => {
      senal = opciones?.signal ?? undefined
      return new Promise<Response>(() => {}) // nunca responde
    })
    const { unmount } = renderizarApp('/')

    expect(senal?.aborted).toBe(false)
    unmount()
    expect(senal?.aborted).toBe(true)
  })
})

describe('C. Error y recuperación', () => {
  it('ante un error muestra un mensaje comprensible y permite reintentar', async () => {
    const fetchMock = simularFetch()
    fetchMock
      .mockResolvedValueOnce(respuestaFalsa({}, { ok: false, status: 500 }))
      .mockResolvedValueOnce(respuestaFalsa(RESPUESTA_OK))
    const usuario = userEvent.setup()
    renderizarApp('/')

    const alerta = await screen.findByRole('alert')
    expect(alerta).toHaveTextContent('No pudimos obtener las cotizaciones. Revisá tu conexión e intentá nuevamente.')

    await usuario.click(within(alerta).getByRole('button', { name: 'Reintentar' }))

    expect(await screen.findByText('Mostrando 3 de 3 criptomonedas')).toBeInTheDocument()
    expect(screen.queryByRole('alert')).not.toBeInTheDocument()
    expect(fetchMock).toHaveBeenCalledTimes(2)
  })
})
