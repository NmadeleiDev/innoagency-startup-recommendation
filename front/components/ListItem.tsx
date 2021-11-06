import Link from 'next/link';
import styled from 'styled-components';
import { StarIcon } from 'components/Icon';
import { IRecomendation } from 'axiosConfig';

const Wrapper = styled.div`
  a {
    display: grid;
    grid-template-columns: 1fr 100px 130px;
    align-items: center;
    grid-gap: 1rem;
    height: 100px;
    padding: 0 2rem;
    cursor: pointer;
    max-width: 1000px;
    margin: 0 auto;

    &:hover {
      background-color: ${({ theme }) => theme.colors.base.hover};
    }

    .title,
    .type,
    .score {
      display: inline-block;
      text-align: center;
    }

    .title {
      text-align: left;
      text-transform: uppercase;
      font-weight: 500;
      font-size: 1.1rem;
    }

    .metrics {
      display: none;
    }

    .imageWrapper {
      display: inline-block;
      position: relative;

      .tooltip {
        display: none;
        position: absolute;
        top: 120%;
        right: 0px;
        background-color: ${({ theme }) => theme.colors.base.lightBG};
        color: ${({ theme }) => theme.colors.text.dark};
        border: 1px solid ${({ theme }) => theme.colors.base.border};
        box-shadow: 2px 2px 10px ${({ theme }) => theme.colors.base.border};
        padding: 0.5em;
        max-width: 250px;
        z-index: 2;
      }
      &:hover .tooltip {
        display: block;
      }
    }

    @media (min-width: 800px) {
      padding-top: 1rem;
      padding-bottom: 1rem;
      grid-template-columns: 1fr 100px 130px 200px;

      .metrics {
        display: flex;
        justify-content: space-between;
        text-align: right;
      }
    }
    @media (min-width: 1200px) {
      height: 120px;
      grid-gap: 2rem;
    }
    /* .image {
      width: 100px;
    } */
  }
`;

interface Props {
  item: IRecomendation;
}

export const types = {
  VentureFund: 'Венчурный фонд',
  Accelerator: 'Акселератор',
  ProgressInstitute: 'Институт развития',
  EngeneeringCenter: 'Инжиниринговый центр',
  BusinessIncubator: 'Бизнес инкубатор',
  Corporation: 'Корпорация',
};

const ListItem = ({ item }: Props) => {
  return (
    <Wrapper>
      <Link href={`/service/${item.id}`}>
        <a>
          <div className="title">{item.name}</div>
          <div className="score">{(item.score * 100).toFixed(2)}%</div>
          <div className="type">{types[item.type]}</div>
          <div className="metrics">{item.metrics}</div>
        </a>
      </Link>
    </Wrapper>
  );
};

export default ListItem;
