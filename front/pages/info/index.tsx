import styled from 'styled-components';
import Input from 'components/Input';
import Button from 'components/Button';
import NextLink from 'components/Link';
import PageHeader from 'components/PageHeader';

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
  return (
    <StyledDiv>
      <PageHeader title="Анкета" className="page-header" />
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
