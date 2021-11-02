import { ChangeEvent, useEffect, useState } from 'react';
import NextImage from 'next/image';
import styled from 'styled-components';
import DatePicker, { registerLocale } from 'react-datepicker';
import ru from 'date-fns/locale/ru';
import 'react-datepicker/dist/react-datepicker.css';
import defaultLogo from 'public/defaultLogo.png';
import { KeyValue } from 'models/Startup';

type IInputType = 'text' | 'number' | 'password' | 'date' | 'file' | 'select';

interface IInputProps {
  width?: number;
  startIcon?: Element;
  endIcon?: Element;
  value?: string | number;
  options?: KeyValue[];
  values?: string[];
  type?: IInputType;
  nolabel?: boolean;
  label?: string;
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void;
  onDateChange?: (date: Date) => void;
  onFileUpload?: (url: string) => void;
  onSelectChange?: (e: ChangeEvent<HTMLSelectElement>) => void;
  onHover?: () => void;
}

type Props = IInputProps & React.HTMLProps<HTMLInputElement>;

const StyledInput = styled.div<{ width?: number }>`
  .label {
    margin-left: 0.6rem;
    display: block;
  }
  .wrapper {
    display: flex;
    align-items: center;
    margin: 1rem 0;
    padding: 5px;
    min-width: 200px;
    background-color: ${({ theme }) => theme.colors.white};
    border: ${({ theme }) => `1px solid ${theme.colors.base.border}`};
    border-radius: 10px;
    transition: 0.3s;

    &:hover,
    &:active,
    &:focus-within {
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

    .option {
      font-size: 1rem;
      padding: 5px;
    }
  }
`;

const StyledFileInput = styled.div`
  .label {
    display: block;
  }
  .wrapper {
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
      <StyledInput className={props.className} width={props.width}>
        {!props.nolabel && (
          <label className="label">{props.label || props.placeholder}</label>
        )}
        <div className="wrapper">
          <DatePicker
            className="input"
            selected={new Date(props.value || new Date())}
            onChange={props.onDateChange}
            locale="ru"
            peekNextMonth
            showMonthDropdown
            showYearDropdown
            dropdownMode="select"
            placeholderText={props.placeholder}
          />
        </div>
      </StyledInput>
    );
  }

  if (props.type === 'select') {
    return (
      <StyledInput className={props.className} width={props.width}>
        {!props.nolabel && (
          <label className="label">{props.label || props.placeholder}</label>
        )}
        <div className="wrapper">
          <select
            multiple={props.multiple}
            name={props.name}
            placeholder={props.placeholder}
            className="input"
            onChange={props.onSelectChange}
            value={props.values}
          >
            {props.options &&
              props.options.map((option) => (
                <option
                  key={option.id}
                  className="option"
                  // selected={props.values?.includes(option.id)}
                  value={option.id}
                >
                  {option.text}
                </option>
              ))}
          </select>
        </div>
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
      <StyledFileInput className={props.className}>
        {!props.nolabel && (
          <label className="label">{props.label || props.placeholder}</label>
        )}
        <div className="wrapper">
          <div className="image">
            <NextImage
              src={img || defaultLogo}
              width={dimentions.width}
              height={dimentions.height}
              alt=""
            />
          </div>
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
        </div>
      </StyledFileInput>
    );
  }

  return (
    <StyledInput className={props.className} width={props.width}>
      {!props.nolabel && (
        <label className="label">{props.label || props.placeholder}</label>
      )}
      <div className="wrapper">
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
      </div>
    </StyledInput>
  );
};

export default Input;
