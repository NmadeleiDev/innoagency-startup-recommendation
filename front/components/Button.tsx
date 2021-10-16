import React from 'react';
import styled from 'styled-components';

interface Props {
  variant?: 'primary' | 'secondary';
}

const StyledDiv = styled.button<Props>`
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1rem;
  font-weight: 500;
  text-transform: uppercase;
  outline: none;
  border: none;
  background-color: ${({ theme, variant = 'primary' }) =>
    variant === 'primary' ? theme.colors.primary : theme.colors.base.darkBG};
  color: ${({ theme }) => theme.colors.text.lighter};
  min-height: 4rem;
  min-width: 10rem;
  padding: 2rem;
  cursor: pointer;
`;

const Button: React.FC<Props & React.HTMLProps<HTMLButtonElement>> = (
  props
) => {
  return (
    <StyledDiv variant={props.variant} onClick={props.onClick}>
      {props.children}
    </StyledDiv>
  );
};

export default Button;