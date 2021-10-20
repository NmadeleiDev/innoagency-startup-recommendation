import styled from 'styled-components';
import Input from 'components/Input';
import Button from 'components/Button';
import NextLink from 'components/Link';
import PageHeader from 'components/PageHeader';
import React, { ChangeEvent, useState } from 'react';
import {
  businessModels,
  investmentRound,
  markets,
  progectStage,
  technologies,
} from 'models/Startup';

const StyledDiv = styled.div`
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
  .contacts {
    grid-area: contacts;
  }
  .owner {
    grid-area: owner;
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
    'contacts'
    'owner'
    'button';

  .inputGroup {
    margin: 0 1rem;
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

  @media (min-width: 700px) {
    grid-template-areas:
      'header header'
      'mainInfo tags'
      'details details'
      'contacts owner'
      'button button';
  }
`;

const Info = () => {
  const [state, setState] = useState({
    inn: '',
    companyName: '',
    foundationDate: 0,
    companyDescription: '',
    logo: '',
    tags: {
      markets: [],
      technologies: [],
      businessModel: [],
    },
    details: {
      teamSize: '',
      projectStage: '',
      companyCity: '',
      companyProducts: '',
      investmentRound: '',
    },
    contacts: {
      email: '',
      phone: '',
      site: '',
    },
    owner: {
      firstName: '',
      lastName: '',
      middleName: '',
      age: 0,
      marriage: false,
    },
  });

  const handleFileUpload = (image: string) => {
    setState((state) => ({ ...state, logo: image }));
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((state) => ({ ...state, [e.target.name]: e.target.value }));
  };

  const handleDateChange = (date: Date | null) => {
    const timestamp = date?.getTime() || 0;
    setState((state) => ({ ...state, foundationDate: timestamp }));
  };

  const handleOwnerDateChange = (date: Date | null) => {
    const timestamp = date?.getTime() || 0;
    setState((state) => ({
      ...state,
      owner: { ...state.owner, age: timestamp },
    }));
  };

  const handleTagsChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const selected = [...e.target.children]
      .filter((child) => (child as HTMLOptionElement).selected)
      .map((child) => (child as HTMLOptionElement).value);
    setState((state) => ({
      ...state,
      tags: { ...state.tags, [e.target.name]: selected },
    }));
  };

  const handleDetailsChange = (e: ChangeEvent<HTMLInputElement>) => {
    const isNumeric = e.target.name.search(/team|project|investment/) > 0;
    setState((state) => ({
      ...state,
      details: {
        ...state.details,
        [e.target.name]: isNumeric ? +e.target.value : e.target.value,
      },
    }));
  };

  const handleContactsChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((state) => ({
      ...state,
      contacts: { ...state.contacts, [e.target.name]: e.target.value },
    }));
  };

  const handleOwnerChange = (e: ChangeEvent<HTMLInputElement>) => {
    setState((state) => ({
      ...state,
      owner: { ...state.owner, [e.target.name]: e.target.value },
    }));
  };

  return (
    <StyledDiv>
      <PageHeader title="Анкета" className="page-header" />
      <div className="mainInfo inputGroup">
        <span className="inputGroupHeader">Основная информация</span>
        <Input
          name="inn"
          onChange={handleChange}
          value={state.inn}
          placeholder="ИНН"
        />
        <Input
          name="companyName"
          onChange={handleChange}
          value={state.companyName}
          placeholder="Название компании"
        />
        <Input
          name="foundationDate"
          type="date"
          onChange={handleChange}
          onDateChange={handleDateChange}
          value={state.foundationDate}
          placeholder="Дата основания компании"
        />
        <Input
          name="companyDescription"
          onChange={handleChange}
          value={state.companyDescription}
          placeholder="Описание компании"
        />
        <Input
          name="logo"
          type="file"
          onFileUpload={handleFileUpload}
          value={state.logo}
          placeholder="Логотип"
        />
      </div>
      <div className="tags inputGroup">
        <span className="inputGroupHeader">Теги</span>
        <label className="label">Рынки</label>
        <Input
          type="select"
          multiple
          name="markets"
          onSelectChange={handleTagsChange}
          options={markets}
          values={state.tags.markets}
          placeholder="Рынки"
        />
        <label className="label">Технологии</label>
        <Input
          type="select"
          id="technologies"
          multiple
          name="technologies"
          onSelectChange={handleTagsChange}
          options={technologies}
          values={state.tags.technologies}
          placeholder="Технологии"
        />
        <label className="label">Бизнес-модель</label>
        <Input
          type="select"
          multiple
          name="businessModel"
          onSelectChange={handleTagsChange}
          options={businessModels}
          values={state.tags.businessModel}
          placeholder="Бизнес-модель"
        />
      </div>
      <div className="details inputGroup">
        <span className="inputGroupHeader">Детали</span>
        <Input
          type="number"
          name="teamSize"
          onChange={handleDetailsChange}
          value={state.details.teamSize}
          placeholder="Размер команды"
        />
        <Input
          name="companyCity"
          onChange={handleDetailsChange}
          value={state.details.companyCity}
          placeholder="Город компании"
        />
        <label className="label">Этап проекта</label>
        <Input
          type="select"
          name="projectStage"
          onSelectChange={(e) =>
            handleDetailsChange(e as unknown as ChangeEvent<HTMLInputElement>)
          }
          options={progectStage}
          value={state.details.projectStage}
          placeholder="Этап проекта"
        />
        <label className="label">Раунд инвестирования</label>
        <Input
          type="select"
          name="investmentRound"
          onSelectChange={(e) =>
            handleDetailsChange(e as unknown as ChangeEvent<HTMLInputElement>)
          }
          options={investmentRound}
          value={state.details.investmentRound}
          placeholder="Раунд инвестирования"
        />
        <Input
          // type="multiinput"
          name="companyProducts"
          onChange={handleDetailsChange}
          value={state.details.companyProducts}
          placeholder="Продкуты компании"
        />
      </div>
      <div className="contacts inputGroup">
        <span className="inputGroupHeader">Контакты</span>
        <Input
          name="email"
          onChange={handleContactsChange}
          value={state.contacts.email}
          placeholder="E-mail"
        />
        <Input
          name="phone"
          onChange={handleContactsChange}
          value={state.contacts.phone}
          placeholder="Телефон"
        />
        <Input
          name="site"
          onChange={handleContactsChange}
          value={state.contacts.site}
          placeholder="Сайт"
        />
      </div>
      <div className="owner inputGroup">
        <span className="inputGroupHeader">Информация об основателе</span>
        <Input
          name="firstName"
          onChange={handleOwnerChange}
          value={state.owner.firstName}
          placeholder="Имя"
        />
        <Input
          name="lastName"
          onChange={handleOwnerChange}
          value={state.owner.lastName}
          placeholder="Фамилия"
        />
        <Input
          name="middleName"
          onChange={handleOwnerChange}
          value={state.owner.middleName}
          placeholder="Отчество"
        />
        <Input
          type="date"
          name="age"
          onChange={handleOwnerChange}
          onDateChange={handleOwnerDateChange}
          value={state.owner.age}
          placeholder="Дата рождения"
        />
        <Input
          type="select"
          name="marriage"
          onChange={handleOwnerChange}
          options={[
            { id: 0, text: 'не замужем / не женат' },
            { id: 1, text: 'замужем / женат' },
          ]}
          value={state.owner.marriage ? 1 : 0}
          placeholder="Женат/замужем"
        />
      </div>
      <div className="button">
        <NextLink href="/list">
          <Button>Подобрать инвестора</Button>
        </NextLink>
      </div>
    </StyledDiv>
  );
};

export default Info;
