import Image from 'next/image';
import styled from 'styled-components';
import { StarIcon } from 'components/Icon';
import { Accelerator } from 'models/Accelerator';

const AcceleratorWrapper = styled.div`
  .title {
    grid-area: title;
  }
  .description {
    grid-area: description;
  }
  display: grid;
  grid-template-areas: 'title';
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
    height: 200px;
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
    grid-gap: 1rem;
    grid-template-areas: 'title description';
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
      <div className="title center">{accelerator.name}</div>
      <div className="description">{accelerator.description}</div>
    </AcceleratorWrapper>
  );
};

export default AcceleratorListItem;
