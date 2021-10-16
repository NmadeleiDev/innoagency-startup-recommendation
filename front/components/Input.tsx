import { ChangeEvent } from 'react';
import styled from 'styled-components';

type IInputType = 'text' | 'password';

interface IInputProps {
  width?: number;
  startIcon?: Element;
  endIcon?: Element;
  value?: string;
  type?: IInputType;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onHover?: () => void;
}

type Props = IInputProps & React.HTMLProps<HTMLInputElement>;

const StyledInput = styled.div<{ width?: number }>`
  display: flex;
  align-items: center;
  margin: 1rem;
  padding: 5px;
  background-color: ${({ theme }) => theme.colors.white};
  width: ${({ width = 200 }) => `calc(${width}px + 10px)`};
  border: ${({ theme }) => `1px solid ${theme.colors.base.border}`};
  border-radius: 10px;

  .input {
    color: ${({ theme }) => theme.colors.base.darkBG};
    width: ${({ width = 200 }) => width + 'px'};
    background-color: inherit;
    font-size: 1rem;
    padding: 1rem;
    outline: none;
    border: none;
  }
`;

const Input = (props: Props) => {
  return (
    <StyledInput width={props.width}>
      <>
        {props.startIcon}
        <input
          className="input"
          onChange={props.onChange}
          value={props.value}
          placeholder={props.placeholder}
        />
        {props.endIcon}
      </>
    </StyledInput>
  );
};

export default Input;
