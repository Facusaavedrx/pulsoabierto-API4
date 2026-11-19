import styled from '@emotion/styled'
import { Link, Route, Routes } from 'react-router-dom'
import Encabezado from './components/Encabezado'
import ListadoPage from './pages/ListadoPage'
import DetallePage from './pages/DetallePage'

const Contenedor = styled.div`
  max-width: 1000px;
  width: 90%;
  margin: 0 auto;
  padding-bottom: 60px;
`

function App () {
  return (
    <Contenedor>
      <Encabezado />
      <main>
        <Routes>
          <Route path='/' element={<ListadoPage />} />
          <Route path='/cripto/:id' element={<DetallePage />} />
          <Route path='*' element={<p>Página no encontrada. <Link to='/'>Volver al inicio</Link></p>} />
        </Routes>
      </main>
    </Contenedor>
  )
}

export default App
