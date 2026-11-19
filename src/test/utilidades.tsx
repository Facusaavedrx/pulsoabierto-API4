import { render } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { vi } from 'vitest'
import App from '../App'

/** Respuesta que imita a CoinGecko. Nunca se llama a la API real en las pruebas. */
export const RESPUESTA_OK = {
  bitcoin: { usd: 63725 },
  ethereum: { usd: 1775 },
  solana: { usd: 72.05 }
}

/** Crea un objeto parecido a Response con lo mínimo que usa el servicio. */
export function respuestaFalsa (cuerpo: unknown, { ok = true, status = 200 } = {}) {
  return {
    ok,
    status,
    json: async () => cuerpo
  } as Response
}

/** Reemplaza fetch global por un mock y lo devuelve para configurarlo. */
export function simularFetch () {
  const fetchMock = vi.fn<typeof fetch>()
  vi.stubGlobal('fetch', fetchMock)
  return fetchMock
}

/** Renderiza la aplicación completa en una ruta dada. */
export function renderizarApp (ruta = '/') {
  return render(
    <MemoryRouter initialEntries={[ruta]} future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <App />
    </MemoryRouter>
  )
}
