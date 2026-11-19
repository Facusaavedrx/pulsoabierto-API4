# Pulso Abierto · Actividad 3

Consulta de cotizaciones de Bitcoin, Ethereum y Solana (API pública de CoinGecko) hecha con React, Vite y TypeScript. En esta etapa se agregan favoritos con Zustand y persistencia, una capa de servicios ordenada y pruebas automatizadas.

## Requisitos

- Node.js 18 o superior y npm

## Comandos

```bash
npm install        # instala las dependencias
npm run dev        # levanta la app en http://localhost:5173
npm test           # ejecuta las pruebas una vez (Vitest + Testing Library)
npm run test:watch # pruebas en modo observación
npm run build      # verifica tipos y genera la versión de producción
```

## Estructura

```
src/
  services/cotizaciones.ts    único acceso a la API (fetch, response.ok, JSON, adaptación)
  store/favoritos.ts          store de Zustand con persist (solo guarda los favoritos)
  hooks/useCotizaciones.ts    estados de carga / resultado / vacío / error + reintento y cancelación
  pages/ListadoPage.tsx       consulta con búsqueda, filtro de favoritos y tarjetas
  pages/DetallePage.tsx       detalle de cada criptomoneda
  components/                 BotonFavorito, TarjetaCripto, Encabezado, MensajeError, ...
  test/                       configuración y utilidades de prueba
```

Las pruebas nunca llaman a CoinGecko: `fetch` se reemplaza por un mock.
