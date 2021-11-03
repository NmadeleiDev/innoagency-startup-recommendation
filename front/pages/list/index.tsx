import styled from 'styled-components';
import PageHeader from 'components/PageHeader';
import List from 'components/List';
import { api, IApiResponse } from 'axiosConfig';
import { useAppSelector } from 'store/store';
import ServicePage from 'components/ServicePage';
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
`;

export const isINN = (id: string) => id.match(/\d+/)?.[0] === id;

const getData = async (id: string) => {
  try {
    let query = '';
    if (isINN(id)) query = '?search_by=inn';
    const { data } = await api.get<IApiResponse>(`/recommend/${id}${query}`);
    console.log(data);
    if (data.data) {
      const accelerators = data.data.accelerators || [];
      const funds = data.data.funds || [];
      const institutes = data.data.progressInstitute || [];

      return {
        accelerators,
        funds,
        institutes,
      };
    }
  } catch (e) {
    console.error(e);
  }
  return {
    accelerators: [],
    funds: [],
    institutes: [],
  };
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const id = query.id?.toString();
  const defaultResponse = {
    props: { accelerators: [], funds: [], institutes: [] },
  };
  if (!id) return defaultResponse;
  const props = await getData(id);
  console.log(props);
  return { props };
};

const ListPage = ({
  accelerators,
  funds,
  institutes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { displayedItem } = useAppSelector((state) => state.services);
  console.log(accelerators, funds, institutes);

  return displayedItem === null ? (
    <StyledDiv>
      <PageHeader title="Идеальные инвесторы" className="page-header" />
      <List header="Акселераторы" items={accelerators} />
      <List header="Венчурные фонды" items={funds} />
      <List header="Институты" items={institutes} />
    </StyledDiv>
  ) : (
    <ServicePage item={displayedItem} />
  );
};

export default ListPage;
