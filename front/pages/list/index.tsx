import styled from 'styled-components';
import PageHeader from 'components/PageHeader';
import List from 'components/List';
import { api, IApiResponse } from 'axiosConfig';
import { useAppSelector } from 'store/store';
import ServicePage from 'components/ServicePage';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { connect, DB_NAME } from 'lib/mongodb';

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

const getData = async (id: string) => {
  try {
    const { data } = await api.get<IApiResponse>(`/recommend/${id}`);
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

/**
 * Finds startup info in database
 * Probably will be replaced with backend method call (if one's ready)
 * @param inn startup INN
 * @returns startup info
 */
const findCompanyByInn = async (inn: string) => {
  const client = await connect();
  // console.log(client, inn);
  const res = await client
    .db(DB_NAME)
    .collection('company')
    .findOne({ inn: `${inn}` });
  console.log(res);
  return res;
};

export const getServerSideProps: GetServerSideProps = async ({ query }) => {
  const id = query.id?.toString();
  const defaultResponse = {
    props: { accelerators: [], funds: [], institutes: [] },
  };
  if (!id) return defaultResponse;
  /*
    id could be _id in database or inn of a company.
    INN contains only numbers, so if it's match equals to inn itself - this is INN
  */
  const isINN = (id: string) => id.match(/\d+/)?.[0] === id;
  console.log(isINN(id), id.match(/\d+/)?.[0]);
  if (isINN(id)) {
    const company = await findCompanyByInn(id);
    // console.log(`comapany`, company);
    if (!company) return defaultResponse;
    const props = await getData(company?._id);
    return { props };
  }
  const props = await getData(id);
  return { props };
};

const ListPage = ({
  accelerators,
  funds,
  institutes,
}: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { displayedItem } = useAppSelector((state) => state.services);

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
