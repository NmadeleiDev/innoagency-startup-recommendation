import path from 'path';
import { promises as fs } from 'fs';
import { GetStaticProps } from 'next';
import Image from 'next/image';
import styled from 'styled-components';
import Button from 'components/Button';
import PageHeader from 'components/PageHeader';
import { Accelerator } from 'models/Accelerator';
import { FC } from 'react';

const StyledCategory = styled.div`
  display: flex;
  flex-direction: column;

  .header {
    font-weight: 500;
    text-transform: uppercase;
  }

  .text {
    text-transform: initial;
  }
`;

interface ICategoryProps {
  header: string;
  className: string;
}

const Category: FC<ICategoryProps> = ({ header, children, className }) => {
  return (
    <StyledCategory className={className}>
      <div className="header">{header}</div>
      <div className="text">{children}</div>
    </StyledCategory>
  );
};

const StyledDiv = styled.div`
  padding: 1rem 0;

  .page-header {
    grid-area: header;
  }

  .list {
    grid-area: list;
  }

  .description {
    grid-area: description;
  }

  .services {
    grid-area: services;
  }

  .button {
    grid-area: button;
  }

  display: grid;
  grid-row-gap: 1rem;
  grid-template-areas:
    'header'
    'list'
    'description'
    'services'
    'button';

  .image {
    width: 100px;
  }

  .description {
    padding: 0 2rem;
  }

  .services {
    padding: 0 2rem;

    ul {
      padding-left: 1.2rem;
    }
  }

  .list {
    padding: 0 2rem;
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-gap: 1rem;
    .image {
      grid-column-start: 1;
      grid-column-end: 2;
      grid-row-start: 1;
      grid-row-end: 3;
    }
  }

  .button {
    display: flex;
    justify-content: center;
    margin-top: 2rem;
  }

  @media (min-width: 1000px) {
    .list {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .item {
      text-align: center;
    }
  }
`;

export async function getStaticPaths() {
  const pwd = path.join(process.cwd(), 'pages', 'api');
  const filePath = path.join(pwd, 'mock.json');
  const accelerators = JSON.parse(
    await fs.readFile(filePath, 'utf-8')
  ) as Accelerator[];
  const paths = accelerators.map((accelerator) => ({
    params: { id: `${accelerator.id}` },
  }));
  console.log('[getStaticPaths]', paths);

  return {
    paths,
    fallback: false,
  };
}

export const getStaticProps: GetStaticProps = async ({ params }) => {
  console.log('[getStaticProps]', params);

  try {
    const pwd = path.join(process.cwd(), 'pages', 'api');
    const filePath = path.join(pwd, 'mock.json');
    const results = JSON.parse(
      await fs.readFile(filePath, 'utf-8')
    ) as Accelerator[];
    const accelerator = results.find((el) => `${el.id}` === params?.id);
    console.log('[getStaticProps]', accelerator);
    return { props: { accelerator } };
  } catch (e) {
    console.error(e);
    return { props: { accelerator: [] } };
  }
};

interface Props {
  accelerator: Accelerator;
}

const AcceleratorItemPage = ({ accelerator }: Props) => {
  const handleSubmit = () => {
    console.log(accelerator);
  };

  /**
   * Gets number and formats string, adding "год" with correct ending
   * @param age interger number, average age of startups
   * @returns formatted string
   */
  const formatAge = (age: number) => {
    const delimeter = age % 10;
    if (age < 1) return 'меньше года';
    if (age > 10 || age < 14) {
      return `${age} лет`;
    }
    switch (delimeter) {
      case 1:
        return `${age} год`;
      case 2:
      case 3:
      case 4:
        return `${age} года`;
      default:
        return `${age} лет`;
    }
  };

  return (
    <StyledDiv>
      <PageHeader title={accelerator.name} className="page-header" />
      <div className="list">
        <div className="image">
          <Image
            width={350}
            height={350}
            src={accelerator.logo}
            alt={`${accelerator.name} logo`}
          />
        </div>
        <Category header="Направление" className="type item">
          {accelerator.type}
        </Category>
        <Category header="Статус" className="status item">
          {accelerator.status}
        </Category>
        <Category header="Участие" className="participation item">
          {accelerator.participation}
        </Category>
        <Category header="Возраст стартапов" className="age item">
          {formatAge(accelerator.averageStartupAge)}
        </Category>
      </div>
      <div className="description">{accelerator.description}</div>
      <Category header="Сервисы" className="services">
        <ul>
          {accelerator.services.map((service) => (
            <li key={service} className="service">
              {service}
            </li>
          ))}
        </ul>
      </Category>
      <div className="button">
        <Button onClick={handleSubmit}>Подать заявку</Button>
      </div>
    </StyledDiv>
  );
};

export default AcceleratorItemPage;
