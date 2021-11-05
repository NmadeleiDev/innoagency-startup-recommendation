import styled from 'styled-components';
import PageHeader from 'components/PageHeader';
import List from 'components/List';
import { api, IApiResponse, IRecomendation } from 'axiosConfig';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';

const StyledDiv = styled.div`
  padding: 1rem 0;

  .page-header {
    grid-area: header;
  }

  .list {
    grid-area: list;
  }

  .button {
    grid-area: button;
  }

  display: grid;
  grid-row-gap: 1rem;
  grid-template-areas:
    'header'
    'list'
    'button';

  .button {
    display: flex;
    justify-content: center;
  }

  .notify {
    font-size: 1.5rem;
    text-align: center;
  }
`;
const prepareReco = (items: (string | number)[][]): IRecomendation[] => {
  return items?.map((item) => ({
    id: item[0].toLocaleString(),
    name: item[1].toLocaleString(),
    type: item[2].toLocaleString(),
    score: +item[3],
    metrics: item.slice(4).map((el) => +el),
  }));
};

const prepareMetrics = (metrics: string[]) => {
  return metrics.map((el) => el);
};
export interface IRecomendationsData {
  reco: (string | number)[][];
  metrics: string[];
}
export interface IRecomendations {
  reco: IRecomendation[];
  metrics: string[];
}

const getData = async ({
  id,
  inn,
}: {
  id?: string;
  inn?: string;
}): Promise<IRecomendations> => {
  try {
    let query = '?search_by=inn';
    let value = inn;
    if (id) {
      query = '?search_by=id';
      value = id;
    }
    const { data } = await api.get<IApiResponse<IRecomendationsData>>(
      `/recommend/${value}${query}`
    );
    // console.log(data);
    if (data.data) {
      const reco = prepareReco(data.data.reco);
      const metrics = data.data.metrics;
      return { reco, metrics };
    }
  } catch (e) {
    console.error(e);
  }
  return {
    reco: [],
    metrics: [],
  };
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const id = query.id?.toString();
  const inn = query.inn?.toString();
  const defaultResponse = {
    props: { reco: [], metrics: [] },
  };
  if (!id && !inn) return defaultResponse;
  const props = await getData({ id, inn });
  // console.log(props);
  return { props };
};

const ListPage = ({
  reco,
  metrics,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  console.log(reco, metrics);

  return (
    <StyledDiv>
      <PageHeader title="Лучшие сервисы" className="page-header" />
      {reco.length ? (
        <List items={reco} metrics={metrics} />
      ) : (
        <div className="notify">Рекомендации не найдены</div>
      )}
    </StyledDiv>
  );
};

export default ListPage;
