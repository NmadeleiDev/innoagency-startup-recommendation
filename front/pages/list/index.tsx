import path from 'path';
import { promises as fs } from 'fs';
import { GetStaticProps } from 'next';
import styled from 'styled-components';
import Button from 'components/Button';
import PageHeader from 'components/PageHeader';
import AcceleratorListItem from 'components/AcceleratorListItem';
import { Accelerator } from 'models/Accelerator';

const StyledDiv = styled.div`
  padding: 1rem 0;

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
export const getStaticProps: GetStaticProps = async (context) => {
  try {
    const pwd = path.join(process.cwd(), 'pages', 'api');
    const filePath = path.join(pwd, 'mock.json');
    const results = await fs.readFile(filePath, 'utf-8');
    return { props: { accelerators: JSON.parse(results) } };
  } catch (e) {
    console.error(e);
    return { props: { accelerators: [] } };
  }
};

interface Props {
  accelerators: Accelerator[];
}

const ListPage = ({ accelerators }: Props) => {
  const handleShowMore = () => {
    console.log(accelerators);
  };

  return (
    <StyledDiv>
      <PageHeader title="Идеальные инвесторы" className="page-header" />
      <div className="list">
        {accelerators &&
          accelerators.map((item) => (
            <AcceleratorListItem key={item.name} accelerator={item} />
          ))}
      </div>
      <div className="button">
        <Button onClick={handleShowMore}>Показать еще</Button>
      </div>
    </StyledDiv>
  );
};

export default ListPage;