import { ChangeEvent, useEffect, useState } from 'react';
import NextImage from 'next/image';
import styled from 'styled-components';
import DatePicker, { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css';
import defaultLogo from 'public/defaultLogo.png';

type IInputType = 'text' | 'password' | 'date' | 'file';

interface IInputProps {
  width?: number;
  startIcon?: Element;
  endIcon?: Element;
  value?: string | number;
  type?: IInputType;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onDateChange?: (date: Date) => void;
  onFileUpload?: (url: string) => void;
  onHover?: () => void;
}

type Props = IInputProps & React.HTMLProps<HTMLInputElement>;

const StyledInput = styled.div<{ width?: number }>`
  display: flex;
  align-items: center;
  margin: 1rem;
  padding: 5px;
  min-width: 200px;
  background-color: ${({ theme }) => theme.colors.white};
  border: ${({ theme }) => `1px solid ${theme.colors.base.border}`};
  border-radius: 10px;
  transition: 0.3s;

  &:hover {
    border: ${({ theme }) => `1px solid ${theme.colors.base.darkBG}`};
  }

  .input {
    color: ${({ theme }) => theme.colors.base.darkBG};
    width: 100%;
    background-color: inherit;
    font-size: 1rem;
    padding: 1rem;
    outline: none;
    border: none;
  }
`;

const StyledFileInput = styled.div`
  display: flex;
  gap: 1rem;
  align-items: center;
  margin: 1rem;
  padding: 5px;

  .label {
    text-align: center;
    width: 100%;
    background-color: ${({ theme }) => theme.colors.white};
    border: ${({ theme }) => `1px solid ${theme.colors.base.border}`};
    border-radius: 10px;
    padding: 10px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      border: ${({ theme }) => `1px solid ${theme.colors.base.darkBG}`};
    }
  }

  .image {
    max-width: 200px;
  }

  .none {
    display: none;
  }
`;

const Input = (props: Props) => {
  const [img, setImage] = useState('');
  const [dimentions, setDimentions] = useState({ width: 200, height: 200 });

  useEffect(() => {
    return () => {
      img && URL.revokeObjectURL(img);
    };
  }, [img]);

  if (props.type === 'date') {
    registerLocale('ru', ru);
    if (!props.onDateChange) {
      throw new Error('onDateChange handler is not set!');
    }
    return (
      <StyledInput width={props.width}>
        <DatePicker
          className="input"
          selected={new Date(props.value || new Date())}
          onChange={props.onDateChange}
          locale="ru"
          peekNextMonth
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          placeholderText="Введите дату создания компании"
        />
      </StyledInput>
    );
  }

  /**
   * Gets image URL and returs image dimentions
   * @param url adress of an image
   * @returns Promise<{width: number, height: number}>
   */
  const imageSize = (
    url: string
  ): Promise<{ width: number; height: number }> => {
    const img = document.createElement('img');

    const promise: Promise<{ width: number; height: number }> = new Promise(
      (resolve, reject) => {
        img.onload = () => {
          const width = img.naturalWidth;
          const height = img.naturalHeight;
          resolve({ width, height });
        };
        img.onerror = reject;
      }
    );
    img.src = url;

    return promise;
  };

  const handleFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      const file = e.target.files[0];
      const url = URL.createObjectURL(file);
      const dim = await imageSize(url);
      setDimentions(dim);
      setImage(url);
      props.onFileUpload?.(url);
    }
  };
  if (props.type === 'file') {
    return (
      <StyledFileInput>
        <div className="image">
          <NextImage
            src={img || defaultLogo}
            width={dimentions.width}
            height={dimentions.height}
            alt=""
          />
        </div>
        <>
          <label htmlFor={props.name} className="label">
            Загрузить
          </label>
          {props.startIcon}
          <input
            id={props.name}
            className="none"
            name={props.name}
            accept="image/*"
            data-max-size="1024"
            onChange={handleFileUpload}
            type={props.type}
            placeholder={props.placeholder}
          />
        </>
      </StyledFileInput>
    );
  }

  return (
    <StyledInput width={props.width}>
      <>
        {props.startIcon}
        <input
          id={props.name}
          className="input"
          name={props.name}
          onChange={props.onChange}
          value={props.value}
          type={props.type || 'text'}
          placeholder={props.placeholder}
        />
        {props.endIcon}
      </>
    </StyledInput>
  );
};

export default Input;
