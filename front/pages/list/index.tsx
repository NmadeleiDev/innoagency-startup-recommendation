import styled from 'styled-components';
import PageHeader from 'components/PageHeader';
import List from 'components/List';
import { api, IApiResponse } from 'axiosConfig';
import { useRouter } from 'next/dist/client/router';
import { useEffect, useState } from 'react';
import { useAppSelector } from 'store/store';
import ServiceItem from 'components/ServiceItem';

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

const ListPage = () => {
  const router = useRouter();
  const { displayedItem } = useAppSelector((state) => state.services);
  const [accelerators, setAccelerators] = useState<string[]>([]);
  const [funds, setFunds] = useState<string[]>([]);
  const [progressInstitutes, setProgressInstitutes] = useState<string[]>([]);

  useEffect(() => {
    const getData = async () => {
      const query = router.asPath.split('?')[1];
      const id = new URLSearchParams(query).get('id');
      const { data } = await api.get<IApiResponse>(`/recommend/${id}`);
      console.log(data);
      if (data.data) {
        const accels = data.data.accelerators || [];
        const funds = data.data.funds || [];
        const inst = data.data.progressInstitute || [];

        setAccelerators(accels);
        setFunds(funds);
        setProgressInstitutes(inst);
      }
    };
    getData();
  }, []);

  return displayedItem === null ? (
    <StyledDiv>
      <PageHeader title="Идеальные инвесторы" className="page-header" />
      <List items={accelerators} />
      <List items={funds} />
    </StyledDiv>
  ) : (
    <ServiceItem item={displayedItem} />
  );
};

export default ListPage;
