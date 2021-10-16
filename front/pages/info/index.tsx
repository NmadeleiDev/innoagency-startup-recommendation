import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';
import { ArrowIcon } from 'components/Icon';
import Input from 'components/Input';
import Button from 'components/Button';
import NextLink from 'components/Link';

const StyledDiv = styled.div`
  padding: 1rem;

  .page-header {
    grid-area: header;
  }

  .col1 {
    grid-area: col1;
  }

  .col2 {
    grid-area: col2;
  }

  .button {
    grid-area: button;
  }

  display: grid;
  grid-row-gap: 1rem;
  grid-template-areas:
    'header'
    'col1'
    'col2'
    'button';

  .page-header {
    margin: 1rem;
    display: grid;
    grid-template-columns: 0 1fr;

    h2 {
      margin: 0;
      padding: 0;
      text-align: center;
    }

    .back {
      transform: rotateY(180deg);
      cursor: pointer;
      transition: 0.3s;
    }

    .back:hover {
      transform: scale(1.1) rotateY(180deg);
    }
  }

  .button {
    display: flex;
    justify-content: center;
  }

  @media (min-width: 700px) {
    grid-template-areas:
      'header header'
      'col1 col2'
      'button button';
  }
`;

const Info = () => {
  const router = useRouter();
  const handleBack = () => {
    router.back();
  };

  return (
    <StyledDiv>
      <div className="page-header">
        <ArrowIcon className="back" onClick={handleBack} />
        <h2>Анкета</h2>
      </div>
      <div className="col1">
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
      </div>
      <div className="col2">
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
      </div>
      <div className="button">
        <NextLink href="/list">
          <Button>Подобрать инвестора</Button>
        </NextLink>
      </div>
    </StyledDiv>
  );
};

export default Info;
