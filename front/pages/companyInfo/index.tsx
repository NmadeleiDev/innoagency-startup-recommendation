import styled from 'styled-components';
import Input from 'components/Input';
import PageHeader from 'components/PageHeader';
import React, { ChangeEvent, FormEvent, useState } from 'react';
import {
  businessModels,
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
import { AxiosResponse } from 'axios';
import { useAppDispatch } from 'store/store';
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

  display: grid;
  grid-row-gap: 1rem;
  grid-template-areas:
    'header'
    'mainInfo'
    'tags'
    'details'
    'profit'
    'button'
    'error';

  .inputGroup {
    border: none;
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
      'error error';
  }
`;

const Info = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [error, setError] = useState('');
  const [state, setState] = useState<CompanyModel>({
    type: 'Company',
    id: '',
    inn: '',
    name: '',
    got_support_from: '',
    did_get_support: '',
    service: '',
    foundation_date: new Date().toISOString(),
    tech_focus: [],
    stage_of_development: '',
    market: [],
    technology: [],
    business_model: [],
    main_okved: '',
    okved_secondary: [],
    msp_category: '',
    is_export: '',
    inno_cluster_member: '',
    skolcovo_member: '',
    is_inno_company: '',
    is_startup: '',
    current_profit: 0,
    current_profit_tax: 0,
    current_revenue: 0,
  });

  const handleInfoChange = (e: ChangeEvent<HTMLInputElement>) => {
    toast(e.target.value);
    setState((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (date: Date | null) => {
    const timestamp = date?.toISOString() || '';
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

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!state.inn) {
      return handleError('ИНН не заполнен');
    }
    try {
      const res: AxiosResponse<IApiResponse> = await api.post(
        '/company',
        state
      );
      console.log(res);
      if (res.status >= 400 && res.status < 500) {
        handleError('Неправильные данные');
      }
      if (res.data?.data?.id) {
        setState((state) => ({ ...state, id: res.data?.data?.id || '' }));

        dispatch(saveUserState(state));
        router.push(`/list?id=${res.data?.data?.id}`);
      }
    } catch (e) {
      console.log(e);
      handleError('Ошибка сохранения, попробуйте позже');
    }
  };

  return (
    <StyledForm onSubmit={handleSubmit}>
      <PageHeader title="Анкета" className="page-header" />
      <fieldset className="mainInfo inputGroup">
        <legend className="inputGroupHeader">Основная информация</legend>
        <Input
          name="inn"
          type="number"
          onChange={handleInfoChange}
          value={state.inn}
          placeholder="ИНН"
          required
        />
        <Input
          name="name"
          onChange={handleInfoChange}
          value={state.name}
          placeholder="Название компании"
        />
        <Input
          name="foundation_date"
          type="date"
          onChange={handleInfoChange}
          onDateChange={handleDateChange}
          value={state.foundation_date}
          placeholder="Дата основания компании"
        />
      </fieldset>
      <fieldset className="tags inputGroup">
        <legend className="inputGroupHeader">Теги</legend>
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
        <Input
          name="main_okved"
          onChange={handleInfoChange}
          value={state.main_okved}
          placeholder="Основной ОКВЭД (номер)"
        />
        <Input
          type="select"
          id="stage_of_development"
          name="stage_of_development"
          onSelectChange={handleDetailsChange}
          options={progectStage}
          value={state.stage_of_development}
          placeholder="Стадия развития компании"
        />
        <Input
          type="select"
          id="msp_category"
          name="msp_category"
          onSelectChange={handleDetailsChange}
          options={msp}
          value={state.msp_category}
          placeholder="Категория МСП"
        />
        <Input
          type="select"
          id="is_export"
          name="is_export"
          onSelectChange={handleDetailsChange}
          options={yesNo}
          value={state.is_export}
          placeholder="Экспортер"
        />
        <Input
          type="select"
          id="inno_cluster_member"
          name="inno_cluster_member"
          onSelectChange={handleDetailsChange}
          options={yesNo}
          value={state.inno_cluster_member}
          placeholder="Участник инновационного кластера города Москвы"
        />
        <Input
          type="select"
          id="skolcovo_member"
          name="skolcovo_member"
          onSelectChange={handleDetailsChange}
          options={yesNo}
          value={state.skolcovo_member}
          placeholder="Участник Сколково"
        />
        <Input
          type="select"
          id="is_inno_company"
          name="is_inno_company"
          onSelectChange={handleDetailsChange}
          options={yesNo}
          value={state.is_inno_company}
          placeholder="Инновационная компания"
        />
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
        <Input
          type="number"
          id="current_profit"
          name="current_profit"
          onChange={handleInfoChange}
          value={state.current_profit}
          placeholder="Чистая прибыль в год, $"
        />
        <Input
          type="number"
          id="current_profit_tax"
          name="current_profit_tax"
          onChange={handleInfoChange}
          value={state.current_profit_tax}
          placeholder="Налог на прибыль в год, %"
        />
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
          value="Подобрать инвестора"
        />
      </div>
      {error && (
        <div className="error">
          <span>{error}</span>
        </div>
      )}
    </StyledForm>
  );
};

export default Info;
