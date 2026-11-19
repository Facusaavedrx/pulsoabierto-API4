import type { CriptoId, CriptoInfo } from '../types/cripto'

export const CRIPTOS: CriptoInfo[] = [
  {
    id: 'bitcoin',
    nombre: 'Bitcoin',
    simbolo: 'BTC',
    descripcion: 'La primera criptomoneda, creada en 2009. Funciona como reserva de valor descentralizada.'
  },
  {
    id: 'ethereum',
    nombre: 'Ethereum',
    simbolo: 'ETH',
    descripcion: 'Plataforma de contratos inteligentes. Su moneda nativa se usa para pagar las operaciones de la red.'
  },
  {
    id: 'solana',
    nombre: 'Solana',
    simbolo: 'SOL',
    descripcion: 'Red orientada a la velocidad y a comisiones bajas, muy usada en aplicaciones descentralizadas.'
  }
]

export function esCriptoId (valor: string | undefined): valor is CriptoId {
  return CRIPTOS.some(cripto => cripto.id === valor)
}
