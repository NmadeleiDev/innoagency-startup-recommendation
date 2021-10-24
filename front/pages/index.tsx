import type { NextPage } from 'next';
import Link from 'next/link';
import styled from 'styled-components';
import Button from 'components/Button';
import PageHeader from 'components/PageHeader';
import { useAppDispatch } from 'store/store';
import { getCompanies, getRandomCompany } from 'store/features/user';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

const Home: NextPage = () => {
  const dispatch = useAppDispatch();
  const getRandomComp = () => {
    dispatch(getRandomCompany());
  };

  return (
    <StyledDiv>
      <PageHeader title="Домашнаяя страница" />
      <Link href="/companyInfo">
        <a>
          <Button>Заполнить анкету</Button>
        </a>
      </Link>
      {/* <Button onClick={getRandomComp}>Случайная компания</Button> */}
    </StyledDiv>
  );
};

export default Home;
