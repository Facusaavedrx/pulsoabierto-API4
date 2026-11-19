import { CRIPTOS } from '../data/criptos'
import type { Cotizacion } from '../types/cripto'

/**
 * La dirección de la API vive solamente en la capa de servicios.
 * Ningún componente de presentación la conoce.
 */
const URL_API =
  'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd'

/** Estructura que devuelve CoinGecko: { bitcoin: { usd: 63725 }, ... } */
export type RespuestaCoinGecko = Partial<Record<string, { usd?: number }>>

/** Error propio para distinguir una respuesta HTTP fallida. */
export class ErrorConsulta extends Error {
  readonly estadoHttp: number

  constructor (estadoHttp: number) {
    super(`La consulta a la API respondió con el código ${estadoHttp}`)
    this.name = 'ErrorConsulta'
    this.estadoHttp = estadoHttp
  }
}

/**
 * Transforma la respuesta externa en la forma que usa la interfaz:
 * un arreglo de cotizaciones con nombre, símbolo y precio.
 * Las criptomonedas sin precio numérico se descartan.
 */
export function adaptarCotizaciones (json: RespuestaCoinGecko): Cotizacion[] {
  return CRIPTOS.flatMap(cripto => {
    const precio = json[cripto.id]?.usd
    return typeof precio === 'number' ? [{ ...cripto, precioUsd: precio }] : []
  })
}

/**
 * Único punto de acceso a la API.
 * 1. fetch  2. comprueba response.ok  3. procesa JSON  4. devuelve datos tipados.
 */
export async function obtenerCotizaciones (signal?: AbortSignal): Promise<Cotizacion[]> {
  const response = await fetch(URL_API, { signal })

  if (!response.ok) {
    throw new ErrorConsulta(response.status)
  }

  const json = (await response.json()) as RespuestaCoinGecko
  return adaptarCotizaciones(json)
}

/** Traduce cualquier error a un mensaje comprensible para la persona usuaria. */
export function mensajeDeError (error: unknown): string {
  if (error instanceof ErrorConsulta && error.estadoHttp === 429) {
    return 'Se hicieron demasiadas consultas seguidas. Esperá unos segundos y volvé a intentar.'
  }
  return 'No pudimos obtener las cotizaciones. Revisá tu conexión e intentá nuevamente.'
}
