import styled from '@emotion/styled'

export const Heading = styled.h1`
  color: #fff;
  text-align: center;
  font-weight: 700;
  font-size: 34px;
  margin-top: 50px;
  margin-bottom: 40px;

  &::after {
    content: '';
    width: 50%;
    height: 6px;
    background-color: #66a2fe;
    display: block;
    margin: 10px auto 0 auto;
  }
`

export const BotonPrincipal = styled.button`
  background-color: #9497ff;
  border: none;
  width: 100%;
  padding: 10px;
  color: #fff;
  font-weight: 700;
  text-transform: uppercase;
  font-size: 18px;
  border-radius: 5px;
  transition: background-color .3s ease;
  margin-top: 20px;
  cursor: pointer;

  &:hover:not(:disabled) { background-color: #7a7dfe; }
  &:disabled { opacity: .6; cursor: not-allowed; }
`
