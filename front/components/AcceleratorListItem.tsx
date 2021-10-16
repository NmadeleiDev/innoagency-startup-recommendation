import Image from 'next/image';
import styled from 'styled-components';
import { StarIcon } from 'components/Icon';
import { Accelerator } from 'models/Accelerator';

const AcceleratorWrapper = styled.div`
  .image {
    grid-area: image;
  }
  .title {
    grid-area: title;
  }
  .description {
    grid-area: description;
  }
  .favorites {
    grid-area: favorites;
  }
  display: grid;
  grid-template-areas: 'image title favorites';
  grid-gap: 1rem;
  height: 120px;
  overflow: hidden;
  padding: 0 2rem;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.base.hover};

    .description::after {
      background: ${({ theme }) =>
        `linear-gradient(0deg, ${theme.colors.base.hover}, rgba(255,255,255,0))`};
    }
  }

  .center {
    display: flex;
    justify-content: center;
    align-items: center;
    text-align: center;
  }

  .image {
    width: 200px;
    height: auto;
  }

  .title {
    text-transform: uppercase;
    font-weight: 500;
    font-size: 1.1rem;
  }

  .description {
    overflow: hidden;
    position: relative;
    height: 100px;
    padding: 10px 0;

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

  .favorite {
    width: 100px;
  }

  @media (min-width: 400px) {
    padding-top: 1rem;
    padding-bottom: 1rem;
    height: 200px;
    grid-gap: 0;
    grid-template-areas:
      'image title favorites'
      'description description description';

    .image,
    .title,
    .favorite {
      height: 50px;
    }

    & .favorite {
      width: 100%;
    }
  }
  @media (min-width: 1200px) {
    height: 120px;
    grid-gap: 1rem;
    grid-template-areas: 'image title description favorites';
  }
  .image {
    width: 100px;
  }
  .title {
    width: 200px;
  }
`;

interface AcceleratorResultProps {
  accelerator: Accelerator;
}

const AcceleratorListItem = ({ accelerator }: AcceleratorResultProps) => {
  return (
    <AcceleratorWrapper>
      <div className="image center">
        <Image
          width={350}
          height={350}
          src={accelerator.logo}
          alt={`${accelerator.name} logo`}
        />
      </div>
      <div className="title center">{accelerator.name}</div>
      <div className="description">{accelerator.description}</div>
      <div className="favorite center">
        <StarIcon favorite={accelerator.isFavorite} />
      </div>
    </AcceleratorWrapper>
  );
};

export default AcceleratorListItem;
