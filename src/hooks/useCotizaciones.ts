import { useCallback, useEffect, useState } from 'react'
import { mensajeDeError, obtenerCotizaciones } from '../services/cotizaciones'
import type { EstadoConsulta } from '../types/cripto'

/**
 * Maneja el ciclo de la consulta (carga, resultado, vacío, error).
 * Estos estados son locales a la vista que los usa: no van al store.
 */
export function useCotizaciones () {
  const [estado, setEstado] = useState<EstadoConsulta>({ tipo: 'cargando' })
  const [numeroConsulta, setNumeroConsulta] = useState(0)

  useEffect(() => {
    // Cada consulta tiene su controlador. Si se inicia otra (o se desmonta
    // el componente) la anterior se cancela y su resultado no se muestra.
    const controlador = new AbortController()
    setEstado({ tipo: 'cargando' })

    obtenerCotizaciones(controlador.signal)
      .then(datos => {
        if (controlador.signal.aborted) return
        setEstado(datos.length === 0 ? { tipo: 'vacio' } : { tipo: 'exito', datos })
      })
      .catch((error: unknown) => {
        if (controlador.signal.aborted) return
        setEstado({ tipo: 'error', mensaje: mensajeDeError(error) })
      })

    return () => controlador.abort()
  }, [numeroConsulta])

  const volverAConsultar = useCallback(() => setNumeroConsulta(n => n + 1), [])

  return { estado, volverAConsultar }
}
