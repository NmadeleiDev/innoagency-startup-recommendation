import styled from 'styled-components';
import Button from 'components/Button';
import PageHeader from 'components/PageHeader';
import { AcceleratorModel, VentureFondModel } from 'models/Startup';
import { useAppDispatch } from 'store/store';
import { setDispayedService } from 'store/features/services';
import TagList from './TagList';
import Category from './Category';

const StyledDiv = styled.div`
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

  .tech {
    grid-area: tech;
  }

  padding: 1rem 0;
  display: grid;
  grid-row-gap: 1rem;
  grid-template-areas:
    'header'
    'list'
    'description'
    'market'
    'tech'
    'focus'
    'services'
    'button';

  .description {
  }

  .list {
    display: flex;
    justify-content: space-evenly;
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
      'tech focus'
      'button button';

    .list {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }

    .item {
      text-align: center;
    }
  }
`;

interface Props {
  item: AcceleratorModel | VentureFondModel;
}

const ServicePage = ({ item }: Props) => {
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
        <Category header="Тип" className="type item">
          {item.type}
        </Category>
        <Category header="Раунд инвестирования" className="status item">
          {item.startup_stage?.join(', ')}
        </Category>
      </div>
      <Category header="Рынки" className="market item">
        <TagList tags={item.market} />
      </Category>
      <Category header="Технологии" className="tech item">
        <TagList tags={item.technologies} />
      </Category>
      <Category header="Сервисы" className="services item">
        <TagList tags={item.services} />
      </Category>
      <Category header="Тех фокус" className="focus item">
        <TagList tags={item.tech_focus} />
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

export default ServicePage;
