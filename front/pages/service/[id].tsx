import styled from 'styled-components';
import Button from 'components/Button';
import PageHeader from 'components/PageHeader';
import { GetStaticProps, InferGetStaticPropsType } from 'next';
import { backend, IApiResponse } from 'axiosConfig';
import { useRouter } from 'next/dist/client/router';
import Loader from 'components/Loader';
import {
  AcceleratorLayout,
  BusinessIncubatorLayout,
  CorporationLayout,
  EngeneeringCenterLayout,
  ProgressInstituteLayout,
  Service,
  VentureFundLayout,
} from 'components/ServiceLayouts';

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

  .buttons {
    grid-area: buttons;
  }

  .items {
    grid-area: items;
  }

  padding: 1rem 0;
  display: grid;
  grid-row-gap: 1rem;
  grid-template-areas:
    'header'
    'list'
    'description'
    'items'
    'buttons';

  .description {
    padding: 2rem;
    margin: 0 auto;
    font-size: 1.2rem;
    max-width: 1200px;
    align-self: center;
  }

  .items {
    display: grid;
    gap: 1rem;
    grid-template-columns: 1fr;
  }

  .list {
    display: flex;
    flex-wrap: wrap;
    gap: 1rem;
    justify-content: space-evenly;
  }

  .buttons {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  @media (min-width: 600px) {
    .items {
      grid-template-columns: 1fr 1fr;
    }
  }

  @media (min-width: 1000px) {
    grid-template-areas:
      'header header'
      'list list'
      'description description'
      'items items'
      'buttons buttons';

    .list {
      display: flex;
      align-items: center;
      justify-content: space-evenly;
    }

    .center {
      text-align: center;
    }
  }
`;

export const getStaticPaths = () => {
  // list of items to statically prerender
  // (more - faslter loading time, slower build time)
  // ex ['61831549b9ccd3672c133dc6', '61831549b9ccd3672c133d75']
  // all other items will be compiled at runtime and cached
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
    const { data } = await backend.get<IApiResponse<Service>>(`/service/${id}`);
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

  if (item?.type === 'VentureFund') {
    service = VentureFundLayout(item);
  } else if (item?.type === 'Accelerator') {
    service = AcceleratorLayout(item);
  } else if (item?.type === 'ProgressInstitute') {
    service = ProgressInstituteLayout(item);
  } else if (item?.type === 'EngeneeringCenter') {
    service = EngeneeringCenterLayout(item);
  } else if (item?.type === 'BusinessIncubator') {
    service = BusinessIncubatorLayout(item);
  } else if (item?.type === 'Corporation') {
    service = CorporationLayout(item);
  }

  const content =
    router.isFallback || !item ? (
      <Loader />
    ) : (
      <>
        {service}
        <div className="buttons">
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
