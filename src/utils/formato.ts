const formateador = new Intl.NumberFormat('es-AR', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

export function formatearUsd (valor: number): string {
  return formateador.format(valor)
}
