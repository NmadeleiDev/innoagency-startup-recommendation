import styled from 'styled-components';
import Button from 'components/Button';
import PageHeader from 'components/PageHeader';
import {
  AcceleratorModel,
  BusinessIncubatorModel,
  CorporationModel,
  EngeneeringCenterModel,
  ProgressInstituteModel,
  VentureFondModel,
} from 'models/Startup';
import TagList from 'components/TagList';
import Category from 'components/Category';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { api, IApiResponse } from 'axiosConfig';
import { useRouter } from 'next/dist/client/router';
import Loader from 'components/Loader';

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
    padding: 2rem;
    margin: 0 auto;
    font-size: 1.2rem;
    max-width: 1200px;
    align-self: center;
    /* border-bottom: 1px solid gray; */
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

const AccFundLayout = (item: VentureFondModel | AcceleratorModel) => (
  <>
    <div className="list">
      <Category header="Тип" className="type item">
        {item.type}
      </Category>
      <Category header="Раунд инвестирования" className="status item">
        {item.startup_stage?.join(', ')}
      </Category>
    </div>
    <div className="description">{item.description}</div>
    <Category header="Рынки" className="market item">
      <TagList tags={item.market} nonFocus={item.market_non_focus} />
    </Category>
    <Category header="Технологии" className="tech item">
      <TagList tags={item.technologies} nonFocus={item.market_non_focus} />
    </Category>
    <Category header="Сервисы" className="services item">
      <TagList tags={item.services} nonFocus={item.market_non_focus} />
    </Category>
    <Category header="Тех фокус" className="focus item">
      <TagList tags={item.tech_focus} nonFocus={item.market_non_focus} />
    </Category>
  </>
);

type Service = VentureFondModel | AcceleratorModel;
// | ProgressInstituteModel
// | EngeneeringCenterModel
// | BusinessIncubatorModel
// | CorporationModel;

export const getStaticPaths = () => {
  // list of items to statically prerender
  // (more - faslter loading time, slower build time)
  // ex ['61831549b9ccd3672c133dc6', '61831549b9ccd3672c133d75']
  const items: string[] = [];
  return {
    paths: items.map((item) => ({ params: { id: item } })),
    fallback: true,
  };
};

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log('getStaticProps', params);
  const id = params?.id;
  try {
    const { data } = await api.get<IApiResponse<Service>>(`/service/${id}`);
    console.log(data);
    return { props: { item: data.data } };
  } catch (e) {
    console.log(e);
  }
  return { props: {} };
};

const ServicePage = ({
  item,
}: {
  item: Service;
}): InferGetStaticPropsType<typeof getStaticProps> => {
  const router = useRouter();
  console.log(item);

  const handleSubmit = () => {
    alert('Тут будет отправлена завяка');
  };

  const handleBack = () => {
    router.back();
  };

  let service = null;

  if (item?.type === 'Accelerator' || item?.type === 'VentureFund') {
    service = AccFundLayout(item);
  }

  const content =
    router.isFallback || !item ? (
      <Loader />
    ) : (
      <>
        {service}
        <div className="button">
          <Button onClick={handleSubmit}>Подать заявку</Button>
        </div>
      </>
    );

  return (
    <StyledDiv>
      <PageHeader
        handleBack={handleBack}
        title={item?.name || 'Сервис'}
        className="page-header"
      />
      {content}
    </StyledDiv>
  );
};

export default ServicePage;

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
