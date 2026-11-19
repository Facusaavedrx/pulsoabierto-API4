import styled from '@emotion/styled'

const Texto = styled.p`
  background-color: #1b3a57;
  padding: 15px;
  border-radius: 10px;
  text-align: center;
  font-size: 18px;
  margin-top: 30px;
`

function MensajeVacio ({ children }: { children: React.ReactNode }) {
  return <Texto role='status'>{children}</Texto>
}

export default MensajeVacio
