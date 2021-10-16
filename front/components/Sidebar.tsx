import React from 'react';
import styled from 'styled-components';
import {
  ArrowBoxIcon,
  ArrowIcon,
  BurgerIcon,
  ConnectIcon,
  HouseIcon,
  LayersIcon,
  LeavesIcon,
  PlaneIcon,
  PlusIcon,
  QuestionIcon,
  RoomIcon,
  StairsIcon,
  WrenchIcon,
} from './Icon';

const StyledDiv = styled.div`
  .burger-button {
    display: block;
  }

  .list {
    display: none;
  }

  @media (min-width: 400px) {
    .list {
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
    }

    .list .item {
      display: flex;
      align-items: center;
    }

    .list .text {
      display: none;
    }

    .burger-button {
      display: none;
    }
  }

  @media (min-width: 700px) {
    .list .text {
      display: block;
      margin-left: 1rem;
    }
  }
`;

interface Props {
  className?: string;
}

const Sidebar = ({ className }: Props) => {
  return (
    <StyledDiv className={className}>
      <BurgerIcon className="burger-button" />
      <div className="list">
        <div className="item">
          <ArrowBoxIcon />
          <span className="text">Arrow</span>
        </div>
        <ArrowIcon />
        <ConnectIcon />
        <HouseIcon />
        <LayersIcon />
        <LeavesIcon />
        <PlaneIcon />
        <PlusIcon />
        <QuestionIcon />
        <RoomIcon />
        <StairsIcon />
        <WrenchIcon />
      </div>
    </StyledDiv>
  );
};

export default Sidebar;
