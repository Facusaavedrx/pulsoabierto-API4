/** Identificadores que usa CoinGecko y que la aplicación conoce. */
export type CriptoId = 'bitcoin' | 'ethereum' | 'solana'

/** Información fija de cada criptomoneda (no viene de la API). */
export interface CriptoInfo {
  id: CriptoId
  nombre: string
  simbolo: string
  descripcion: string
}

/** Forma que usa la interfaz luego de adaptar la respuesta de la API. */
export interface Cotizacion extends CriptoInfo {
  precioUsd: number
}

/** Representaciones diferenciadas del ciclo de una consulta. */
export type EstadoConsulta =
  | { tipo: 'cargando' }
  | { tipo: 'exito'; datos: Cotizacion[] }
  | { tipo: 'vacio' }
  | { tipo: 'error'; mensaje: string }
