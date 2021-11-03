import Image from 'next/image';
import styled from 'styled-components';
import { StarIcon } from 'components/Icon';
import { Accelerator } from 'models/Accelerator';
import {
  AcceleratorModel,
  ServiceModel,
  VentureFondModel,
} from 'models/Startup';

const Wrapper = styled.div`
  .title {
    grid-area: title;
  }
  .description {
    grid-area: description;
  }
  .type {
    grid-area: type;
  }

  display: grid;
  grid-template-areas: 'title';
  grid-gap: 1rem;
  height: 120px;
  overflow: hidden;
  padding: 0 2rem;
  cursor: pointer;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.base.hover};

    .description::after {
      background: ${({ theme }) =>
        `linear-gradient(0deg, ${theme.colors.base.hover}, rgba(255,255,255,0))`};
    }
  }

  .title {
    text-align: center;
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1.1rem;
  }

  .description {
    overflow: hidden;
    position: relative;
    height: 100px;
    padding: 10px 0;
    display: none;

    &::after {
      content: '';
      width: 100%;
      height: 100%;
      position: absolute;
      bottom: 0;
      left: 0;
      background: ${({ theme }) =>
        `linear-gradient(0deg, ${theme.colors.base.lightBG}, rgba(255,255,255,0))`};
    }
  }

  @media (min-width: 400px) {
    padding-top: 1rem;
    padding-bottom: 1rem;
    /* height: 200px; */
    grid-gap: 0;
    grid-template-areas:
      'title'
      'description';

    .title {
      height: 50px;
    }

    .description {
      display: block;
    }
  }
  @media (min-width: 1200px) {
    height: 120px;
    grid-gap: 2rem;
    grid-template-columns: 1fr 2fr;
    grid-template-areas: 'title description';
  }
  .image {
    width: 100px;
  }
`;

interface Props {
  item: VentureFondModel | AcceleratorModel;
  onClick?: () => void;
}

const defaultDescription = `Бесплатная программа для высокотехнологичных стартапов и компаний в сфере умного производства от крупнейшего в мире производителя стальных труб для нефтегазового сектора компании ТМК. Позволяет запустить пилот или стать партнером корпорациии. С каждым проектом проводится индивидуальная работа, алгоритм зависит от проработки проекта его готовности к внедрению.`;

const ListItem = ({ item, onClick }: Props) => {
  return (
    <Wrapper onClick={onClick}>
      <div className="title">{item.name}</div>
      <div className="description">
        {item.description || defaultDescription}
      </div>
    </Wrapper>
  );
};

export default ListItem;
