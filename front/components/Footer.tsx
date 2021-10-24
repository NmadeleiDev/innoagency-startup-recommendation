import React from 'react';
import styled from 'styled-components';
import theme from 'styles/theme';
import { AimIcon } from './Icon';

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  height: 200px;

  .aim {
    background-color: ${({ theme }) => theme.colors.base.darkerBG};
    display: grid;
    align-content: center;
    padding: 1.5rem;
  }

  .info {
    display: flex;
    flex-direction: column;
    padding: 3rem;
    font-weight: 300;
    color: ${({ theme }) => theme.colors.text.gray};
    background-color: ${({ theme }) => theme.colors.base.darkBG};

    .text {
      margin: 1rem;
    }
  }

  @media (min-width: 770px) {
    grid-template-columns: 300px 1fr;
    width: 100vw;
  }
`;

const Footer = () => {
  return (
    <StyledDiv>
      <div className="aim">
        <AimIcon width={230} height={100} color={theme.colors.text.gray} />
      </div>
      <div className="info">
        <span className="text">О ПРОЕКТЕ</span>
        <span className="text">
          Политика в отношении обработки персональных данных
        </span>
        <span className="text">Rolling Drones. 2021</span>
      </div>
    </StyledDiv>
  );
};

export default Footer;
