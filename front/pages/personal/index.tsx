import styled from 'styled-components';
import Input from 'components/Input';
import PageHeader from 'components/PageHeader';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import {
  businessModels,
  investmentRound,
  markets,
  progectStage,
  CompanyModel,
  technologies,
  techFocus,
  yesNo,
  msp,
} from 'models/Startup';
import { useRouter } from 'next/dist/client/router';
import { api, IApiResponse } from 'axiosConfig';
import toast from 'react-hot-toast';
import sanitizeHtml from 'sanitize-html';
import { AxiosResponse } from 'axios';
import { useAppDispatch, useAppSelector } from 'store/store';
import { saveUserState } from 'store/features/user';

const StyledForm = styled.form`
  padding: 1rem 0;

  .page-header {
    grid-area: header;
  }

  .mainInfo {
    grid-area: mainInfo;
  }

  .tags {
    grid-area: tags;
  }
  .details {
    grid-area: details;
  }
  .profit {
    grid-area: profit;
  }
  .error {
    grid-area: error;
  }

  .button {
    grid-area: button;
  }

  .success {
    grid-area: success;
  }

  display: grid;
  grid-row-gap: 1rem;
  grid-template-areas:
    'header'
    'mainInfo'
    'tags'
    'details'
    'profit'
    'button'
    'error'
    'success';

  .inputGroup {
    margin: 0 1rem;
    border: none;
  }

  .label {
    margin-left: 1rem;
    display: block;
  }

  .inputGroupHeader {
    width: 100%;
    font-weight: 500;
    font-size: 1rem;
    margin: 1rem;
    display: flex;
    justify-content: center;
  }

  .button {
    display: flex;
    justify-content: center;
  }

  .error {
    display: flex;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.secondary};
  }

  .success {
    display: flex;
    justify-content: center;
    font-size: 1.5rem;
    font-weight: 500;
    color: ${({ theme }) => theme.colors.primary};
  }

  .submitButton {
    font-size: 1rem;
    font-weight: 500;
    text-transform: uppercase;
    outline: none;
    border: none;
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.text.lighter};
    min-height: 4rem;
    min-width: 10rem;
    padding: 2rem;
    cursor: pointer;
    transform: scale(1);

    &:hover,
    &:active,
    &:focus-within {
      transform: scale(1.1);
    }
  }

  @media (min-width: 700px) {
    grid-template-areas:
      'header header'
      'mainInfo tags'
      'details tags'
      'details profit'
      'button button'
      'error error'
      'success success';
  }
`;

const Personal = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const user = useAppSelector((state) => state.user);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [state, setState] = useState<CompanyModel>(user.user);

  const handleInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (date: Date | null) => {
    const timestamp = date?.getTime() + '' || '';
    setState((state) => ({ ...state, foundation_date: timestamp }));
  };

  const handleTagsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = [...e.target.children]
      .filter((child) => (child as HTMLOptionElement).selected)
      .map((child) => (child as HTMLOptionElement).value);
    setState((state) => ({
      ...state,
      [e.target.name]: selected,
    }));
  };

  const handleDetailsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setState((state) => ({
      ...state,
      [e.target.name]: e.target.value,
    }));
  };

  const handleError = (text: string) => {
    setError(text);
    setTimeout(() => {
      setError('');
    }, 5000);
  };

  const handleSuccess = (text: string) => {
    setSuccess(text);
    setTimeout(() => {
      setSuccess('');
    }, 5000);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!state.inn) {
      return handleError('ИНН не заполнен');
    }
    try {
      const res: AxiosResponse<IApiResponse> = await api.put(
        `/entity${state.id}`,
        state
      );
      console.log(res);
      if (res.status >= 400 && res.status < 500) {
        handleError(res.data.error || 'Неправильные данные');
      }
      if (res.data?.data?.id) {
        setState((state) => ({ ...state, id: res.data?.data?.id || '' }));
        dispatch(saveUserState({ ...state, id: res.data?.data?.id }));
        handleSuccess('Сохранено!');
      }
    } catch (e) {
      console.log(e);
      handleError('Ошибка сохранения, попробуйте позже');
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <PageHeader title="Информация о компании" className="page-header" />
      <fieldset className="mainInfo inputGroup">
        <legend className="inputGroupHeader">Основная информация</legend>
        <label className="label">ИНН</label>
        <Input
          name="inn"
          type="number"
          onChange={handleInfoChange}
          value={state.inn}
          placeholder="ИНН"
          required
        />
        <label className="label">Название компании</label>
        <Input
          name="name"
          onChange={handleInfoChange}
          value={state.name}
          placeholder="Название компании"
        />
        <label className="label">Дата основания компании</label>
        <Input
          name="foundation_date"
          type="date"
          onChange={handleInfoChange}
          onDateChange={handleDateChange}
          value={+state.foundation_date}
          placeholder="Дата основания компании"
        />
      </fieldset>
      <fieldset className="tags inputGroup">
        <legend className="inputGroupHeader">Теги</legend>
        <label className="label">Технологический фокус компании</label>
        <Input
          type="select"
          multiple
          id="tech_focus"
          name="tech_focus"
          onSelectChange={handleTagsChange}
          options={techFocus}
          onChange={handleInfoChange}
          values={state.tech_focus}
          placeholder="Технологический фокус компании"
        />
        <label className="label">Рынки</label>
        <Input
          type="select"
          multiple
          id="market"
          name="market"
          onSelectChange={handleTagsChange}
          options={markets}
          values={state.market}
          placeholder="Рынки"
        />
        <label className="label">Технологии</label>
        <Input
          type="select"
          id="technology"
          multiple
          name="technology"
          onSelectChange={handleTagsChange}
          options={technologies}
          values={state.technology}
          placeholder="Технологии"
        />
        <label className="label">Бизнес-модель</label>
        <Input
          type="select"
          multiple
          id="business_model"
          name="business_model"
          onSelectChange={handleTagsChange}
          options={businessModels}
          values={state.business_model}
          placeholder="Бизнес-модель"
        />
      </fieldset>
      <fieldset className="details inputGroup">
        <legend className="inputGroupHeader">Детали</legend>
        <label className="label">Основной ОКВЭД</label>
        <Input
          name="main_okved"
          onChange={handleInfoChange}
          value={state.main_okved}
          placeholder="Основной ОКВЭД (номер)"
        />
        <label className="label">Стадия развития компании</label>
        <Input
          type="select"
          id="stage_of_development"
          name="stage_of_development"
          onSelectChange={handleDetailsChange}
          options={progectStage}
          value={state.stage_of_development}
          placeholder="РынСтадия развития компаниики"
        />
        <label className="label">Категория МСП</label>
        <Input
          type="select"
          id="msp_category"
          name="msp_category"
          onSelectChange={handleDetailsChange}
          options={msp}
          value={state.msp_category}
          placeholder="Категория МСП"
        />
        <label className="label">Экспортер</label>
        <Input
          type="select"
          id="is_export"
          name="is_export"
          onSelectChange={handleDetailsChange}
          options={yesNo}
          value={state.is_export}
          placeholder="Экспортер"
        />
        <label className="label">
          Участник инновационного кластера города Москвы
        </label>
        <Input
          type="select"
          id="inno_cluster_member"
          name="inno_cluster_member"
          onSelectChange={handleDetailsChange}
          options={yesNo}
          value={state.inno_cluster_member}
          placeholder="Участник инновационного кластера города Москвы"
        />
        <label className="label">Участник Сколково</label>
        <Input
          type="select"
          id="skolcovo_member"
          name="skolcovo_member"
          onSelectChange={handleDetailsChange}
          options={yesNo}
          value={state.skolcovo_member}
          placeholder="Участник Сколково"
        />
        <label className="label">Инновационная компания</label>
        <Input
          type="select"
          id="is_inno_company"
          name="is_inno_company"
          onSelectChange={handleDetailsChange}
          options={yesNo}
          value={state.is_inno_company}
          placeholder="Инновационная компания"
        />
        <label className="label">Стартап</label>
        <Input
          type="select"
          id="is_startup"
          name="is_startup"
          onSelectChange={handleDetailsChange}
          options={yesNo}
          value={state.is_startup}
          placeholder="Стартап"
        />
      </fieldset>
      <fieldset className="profit inputGroup">
        <legend className="inputGroupHeader">Данные о доходах</legend>
        <label className="label">Чистая прибыль в год, $</label>
        <Input
          type="number"
          id="current_profit"
          name="current_profit"
          onChange={handleInfoChange}
          value={state.current_profit}
          placeholder="Чистая прибыль в год, $"
        />
        <label className="label">Налог на прибыль в год, %</label>
        <Input
          type="number"
          id="current_profit_tax"
          name="current_profit_tax"
          onChange={handleInfoChange}
          value={state.current_profit_tax}
          placeholder="Налог на прибыль в год, %"
        />
        <label className="label">Валовая прибыль в год, $</label>
        <Input
          type="number"
          id="current_revenue"
          name="current_revenue"
          onChange={handleInfoChange}
          value={state.current_revenue}
          placeholder="Валовая прибыль в год, $"
        />
      </fieldset>
      <div className="button">
        <input
          className="submitButton"
          type="submit"
          value="Сохранить данные"
        />
      </div>
      {error && (
        <div className="error">
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="success">
          <span>{success}</span>
        </div>
      )}
    </StyledForm>
  );
};

export default Personal;
