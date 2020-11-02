import { HTMLAttributes } from 'react'
import styled from 'styled-components'

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  $background: string
}

export default styled.button<ButtonProps>`
  border: 0;
  background: ${({ $background }) => $background};
  color: white;
  padding: 8px 16px;
  border-radius: 4px;
  cursor: pointer;
  transition: opacity 0.22s ease-in;

  &:hover {
    opacity: 0.65;
  }
`
