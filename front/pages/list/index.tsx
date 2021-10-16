import styled from 'styled-components';
import Button from 'components/Button';
import Input from 'components/Input';
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
    'list'
    'button';

  .button {
    display: flex;
    justify-content: center;
  }
`;

const ListPage = () => {
  const handleShowMore = () => {
    console.log('show more');
  };

  return (
    <StyledDiv>
      <PageHeader title="Идеальные инвесторы" className="page-header" />
      <div className="list">
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
      </div>
      <div className="button">
        <Button onClick={handleShowMore}>Показать еще</Button>
      </div>
    </StyledDiv>
  );
};

export default ListPage;
