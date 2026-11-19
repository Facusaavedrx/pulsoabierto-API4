import { describe, expect, it } from 'vitest'
import { ErrorConsulta, adaptarCotizaciones, obtenerCotizaciones } from './cotizaciones'
import { RESPUESTA_OK, respuestaFalsa, simularFetch } from '../test/utilidades'

describe('D. Servicio obtenerCotizaciones', () => {
  it('con una respuesta HTTP exitosa devuelve los datos con la forma que usa la aplicación', async () => {
    const fetchMock = simularFetch()
    fetchMock.mockResolvedValue(respuestaFalsa(RESPUESTA_OK))

    const resultado = await obtenerCotizaciones()

    expect(fetchMock).toHaveBeenCalledTimes(1)
    expect(fetchMock.mock.calls[0][0]).toBe(
      'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd'
    )
    expect(resultado).toEqual([
      expect.objectContaining({ id: 'bitcoin', nombre: 'Bitcoin', simbolo: 'BTC', precioUsd: 63725 }),
      expect.objectContaining({ id: 'ethereum', nombre: 'Ethereum', simbolo: 'ETH', precioUsd: 1775 }),
      expect.objectContaining({ id: 'solana', nombre: 'Solana', simbolo: 'SOL', precioUsd: 72.05 })
    ])
  })

  it('con ok: false lanza un ErrorConsulta con el código HTTP', async () => {
    const fetchMock = simularFetch()
    fetchMock.mockResolvedValue(respuestaFalsa({}, { ok: false, status: 429 }))

    const promesa = obtenerCotizaciones()

    await expect(promesa).rejects.toBeInstanceOf(ErrorConsulta)
    await expect(promesa).rejects.toMatchObject({ estadoHttp: 429 })
  })

  it('la transformación descarta las monedas que no traen precio numérico', () => {
    expect(adaptarCotizaciones({ bitcoin: { usd: 10 }, solana: {} })).toEqual([
      expect.objectContaining({ id: 'bitcoin', precioUsd: 10 })
    ])
    expect(adaptarCotizaciones({})).toEqual([])
  })
})
