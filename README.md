# Pulso Abierto

Aplicación web que consulta en vivo los precios en dólares de **Bitcoin, Ethereum y Solana** usando la API pública de [CoinGecko](https://www.coingecko.com/). Permite buscar y filtrar criptomonedas, ver el detalle de cada una y marcar favoritas, que se conservan aunque se recargue la página.

**Aplicación publicada en Netlify:** https://URL-PENDIENTE.netlify.app
**Repositorio:** https://github.com/Facusaavedrx/pulsoabierto-API4

## Tecnologías principales

- React 18 + TypeScript
- Vite 5 (servidor de desarrollo y build)
- React Router 6 (listado y páginas de detalle)
- Zustand 5 con `persist` (favoritos guardados en `localStorage`)
- Emotion (estilos con `styled`)
- Vitest 2 + Testing Library (pruebas automatizadas)
- Netlify (publicación)

## Requisitos

- Node.js 18 o superior (en Netlify se usa Node 20)
- npm

## Instalación y uso

```bash
git clone https://github.com/Facusaavedrx/pulsoabierto-API4.git
cd pulsoabierto-API4
npm install          # instala las dependencias
```

| Acción | Comando |
| --- | --- |
| Ejecutar en desarrollo (http://localhost:5173) | `npm run dev` |
| Ejecutar las pruebas | `npm run test` |
| Pruebas en modo observación | `npm run test:watch` |
| Verificar tipos | `npm run typecheck` |
| Generar el build productivo (carpeta `dist/`) | `npm run build` |
| Comprobar el build (http://localhost:4173) | `npm run preview` |

El proyecto no tiene script de lint; la verificación estática se hace con `npm run typecheck` (TypeScript en modo estricto), que también corre dentro de `npm run build`.

## Variables de entorno

No utiliza variables de entorno. La API de CoinGecko es pública y no requiere clave. Los archivos `.env` quedan excluidos en `.gitignore` por si se agregan en el futuro.

## Estructura

```
src/
  services/cotizaciones.ts    único acceso a la API (fetch, response.ok, JSON, adaptación)
  store/favoritos.ts          store de Zustand con persist (solo guarda los favoritos)
  hooks/useCotizaciones.ts    estados de carga / resultado / vacío / error + reintento y cancelación
  pages/ListadoPage.tsx       formulario de búsqueda con validación, filtro de favoritos y tarjetas
  pages/DetallePage.tsx       detalle de cada criptomoneda (/cripto/:id)
  components/                 BotonFavorito, TarjetaCripto, Encabezado, MensajeError, ...
  data/criptos.ts             catálogo de criptomonedas que conoce la app
  test/                       configuración y utilidades de prueba
netlify.toml                  configuración de build y redirección SPA para Netlify
```

Las pruebas nunca llaman a CoinGecko: `fetch` se reemplaza por un mock.

## Despliegue en Netlify

La configuración está en `netlify.toml`, así que Netlify la toma automáticamente al importar el repositorio:

- **Comando de build:** `npm run build`
- **Directorio de publicación:** `dist` (la salida de Vite)
- **Versión de Node:** 20
- **Redirección SPA:** `/*  →  /index.html  (200)`. Sin esta regla, abrir o recargar una ruta como `/cripto/bitcoin` devolvería 404, porque ese archivo no existe en el servidor; con ella, Netlify entrega `index.html` y React Router muestra la vista correcta.

Pasos: en Netlify, *Add new site → Import an existing project → GitHub*, elegir `Facusaavedrx/pulsoabierto-API4`, comprobar que los valores anteriores aparezcan completados y presionar *Deploy*.

## Revisión de la versión final

### Recorridos comprobados

1. Consulta de precios: las tres criptomonedas se muestran con su precio en USD.
2. Navegación del listado al detalle (`/cripto/:id`) y regreso con "Volver al listado".
3. Favorito marcado en el listado aparece marcado en el detalle (y viceversa); el contador del encabezado se actualiza.
4. Después de recargar, los favoritos siguen marcados (persistencia en `localStorage`).
5. Formulario: la búsqueda filtra por nombre o símbolo, el filtro "Mostrar solo favoritos" funciona y la validación rechaza entradas no permitidas.
6. Vista móvil (390 px) y de escritorio (1280 px) sin desplazamiento horizontal.

**Corrección realizada:** el recorrido 5 pide comprobar la validación del formulario, pero el campo de búsqueda no tenía ninguna. Se agregó una validación mínima (solo letras, números y espacios, hasta 30 caracteres) con mensaje de error accesible (`aria-invalid`, `aria-describedby`, `role="alert"`) y una prueba nueva que la cubre. No se agregaron funcionalidades principales.

### Mejora de mantenibilidad

- **Problema identificado:** la lista de criptomonedas estaba duplicada. El catálogo `CRIPTOS` (`src/data/criptos.ts`) define `bitcoin`, `ethereum` y `solana`, pero la URL de la API en `src/services/cotizaciones.ts` repetía esos mismos ids escritos a mano (`ids=bitcoin,ethereum,solana`). Si se agregaba o quitaba una moneda había que acordarse de cambiar los dos lugares.
- **Cambio realizado:** la URL ahora se arma a partir del catálogo: `CRIPTOS.map(cripto => cripto.id).join(',')`. Es una única modificación acotada al servicio; el resto de la aplicación no cambia.
- **Cómo se comprobó que no hubo regresiones:** la prueba del servicio se hizo más estricta y ahora verifica que la URL generada sea exactamente la misma que antes (`...?ids=bitcoin,ethereum,solana&vs_currencies=usd`). Además pasaron todas las pruebas (`npm run test`), el proyecto compila (`npm run build`) y en `npm run preview` la consulta sigue mostrando los tres precios.

## Verificación final

| Verificación | Resultado |
| --- | --- |
| Pruebas ejecutadas (`npm run test`) | 3 archivos, 14 pruebas, todas aprobadas |
| Verificación de tipos (`npm run typecheck`) | Sin errores |
| Lint | El proyecto no tiene script de lint |
| Build generado (`npm run build`) | Correcto, salida en `dist/` |
| Preview comprobado (`npm run preview`) | Carga, consulta de datos, navegación, recarga de detalle, favoritos, formulario y vista móvil/escritorio correctos; sin errores bloqueantes en consola |
| Despliegue realizado | Netlify: https://URL-PENDIENTE.netlify.app |
| Fecha de verificación | 19/11/2026 |
