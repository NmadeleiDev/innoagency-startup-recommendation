import Button from 'components/Button';
import type { NextPage } from 'next';
import Link from 'next/link';
import styled from 'styled-components';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;

  .page-header {
    margin: 1rem;
    display: grid;

    h2 {
      margin: 0;
      padding: 0;
      text-align: center;
    }
  }
`;

const Home: NextPage = () => {
  return (
    <StyledDiv>
      <div className="page-header">
        <h2>Домашнаяя страница</h2>
      </div>

      <Link href="/info">
        <a>
          <Button>Заполнить анкету</Button>
        </a>
      </Link>
    </StyledDiv>
  );
};

export default Home;
