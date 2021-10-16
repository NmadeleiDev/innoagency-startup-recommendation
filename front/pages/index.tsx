import type { NextPage } from 'next';
import Link from 'next/link';
import styled from 'styled-components';
import Button from 'components/Button';
import PageHeader from 'components/PageHeader';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;
`;

const Home: NextPage = () => {
  return (
    <StyledDiv>
      <PageHeader title="Домашнаяя страница" />
      <Link href="/info">
        <a>
          <Button>Заполнить анкету</Button>
        </a>
      </Link>
    </StyledDiv>
  );
};

export default Home;
