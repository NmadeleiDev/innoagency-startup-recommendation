import { GetStaticProps } from 'next';
import styled from 'styled-components';
import Button from 'components/Button';
import PageHeader from 'components/PageHeader';
import { FC } from 'react';
import {
  AcceleratorModel,
  ServiceModel,
  VentureFondModel,
} from 'models/Startup';
import { api, IApiResponse } from 'axiosConfig';
import { useAppDispatch } from 'store/store';
import { setDispayedService } from 'store/features/services';

const StyledCategory = styled.div`
  display: flex;
  flex-direction: column;

  .header {
    font-weight: 500;
    text-transform: uppercase;
  }

  .text {
    text-transform: initial;
  }
`;

interface ICategoryProps {
  header: string;
  className: string;
}

const Category: FC<ICategoryProps> = ({ header, children, className }) => {
  return (
    <StyledCategory className={className}>
      <div className="header">{header}</div>
      <div className="text">{children}</div>
    </StyledCategory>
  );
};

const StyledDiv = styled.div`
  padding: 1rem 0;

  .page-header {
    grid-area: header;
  }

  .list {
    grid-area: list;
  }

  .description {
    grid-area: description;
  }

  .services {
    grid-area: services;
  }

  .focus {
    grid-area: focus;
  }

  .market {
    grid-area: market;
  }

  .button {
    grid-area: button;
  }

  display: grid;
  grid-row-gap: 1rem;
  grid-template-areas:
    'header'
    'list'
    'description'
    'market'
    'focus'
    'services'
    'button';

  .image {
    width: 100px;
  }

  .description {
    padding: 0 2rem;
  }
  ul {
    padding-left: 1.2rem;
    list-style: none;
  }

  .services {
    padding: 0 2rem;
  }

  .list {
    padding: 0 2rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
    .image {
      grid-column-start: 1;
      grid-column-end: 2;
      grid-row-start: 1;
      grid-row-end: 3;
    }
  }

  .button {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  @media (min-width: 1000px) {
    grid-template-areas:
      'header header'
      'list list'
      'description description'
      'market services'
      'focus focus'
      'button button';

    .list {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .item {
      text-align: center;
    }
  }
`;

interface Props {
  item: AcceleratorModel | VentureFondModel;
}

const ServiceItem = ({ item }: Props) => {
  const dispatch = useAppDispatch();

  const handleSubmit = () => {
    console.log(item);
  };

  /**
   * Gets number and formats string, adding "год" with correct ending
   * @param age interger number, average age of startups
   * @returns formatted string
   */
  const formatAge = (age: number) => {
    const delimeter = age % 10;
    if (age < 1) return 'меньше года';
    if (age > 10 || age < 14) {
      return `${age} лет`;
    }
    switch (delimeter) {
      case 1:
        return `${age} год`;
      case 2:
      case 3:
      case 4:
        return `${age} года`;
      default:
        return `${age} лет`;
    }
  };

  const handleBack = () => {
    dispatch(setDispayedService(null));
  };

  const content = item ? (
    <>
      <div className="list">
        <Category header="Направление" className="type item">
          {item.type}
        </Category>
        {/* <Category header="Раунд инвестирования" className="status item">
          {item.market}
        </Category> */}
        {/* <Category header="Тип фонда" className="ownership item">
          {item.type_of_ownership}
        </Category> */}
      </div>
      <Category header="Рынки" className="market item">
        <ul>
          {item.market?.map((service) => (
            <li key={service} className="service">
              {service}
            </li>
          ))}
        </ul>
      </Category>
      <Category header="Технический фокус" className="focus item">
        <ul>
          {item.tech_focus?.map((service) => (
            <li key={service} className="service">
              {service}
            </li>
          ))}
        </ul>
      </Category>
      {/* <div className="description">{item.description}</div> */}
      <Category header="Сервисы" className="services">
        <ul>
          {item.services?.map((service) => (
            <li key={service} className="service">
              {service}
            </li>
          ))}
        </ul>
      </Category>
      <div className="button">
        <Button onClick={handleSubmit}>Подать заявку</Button>
      </div>
    </>
  ) : null;

  return (
    <StyledDiv>
      <PageHeader
        handleBack={handleBack}
        title={item.name || 'Сервис'}
        className="page-header"
      />
      {content}
    </StyledDiv>
  );
};

export default ServiceItem;
