import styled from '@emotion/styled'

const Caja = styled.div`
  background-color: #b7322c;
  color: #fff;
  padding: 15px;
  font-size: 20px;
  font-weight: 700;
  text-align: center;
  border-radius: 10px;
  margin-top: 30px;
`
const BotonReintentar = styled.button`
  margin-top: 15px;
  background-color: #fff;
  color: #b7322c;
  border: none;
  border-radius: 6px;
  padding: 8px 18px;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
`

interface Props {
  mensaje: string
  onReintentar: () => void
}

function MensajeError ({ mensaje, onReintentar }: Props) {
  return (
    <Caja role='alert'>
      <p style={{ margin: 0 }}>{mensaje}</p>
      <BotonReintentar type='button' onClick={onReintentar}>Reintentar</BotonReintentar>
    </Caja>
  )
}

export default MensajeError
