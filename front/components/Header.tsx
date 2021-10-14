import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import aimLogo from 'public/aim-logo.svg';
import startupLogo from 'public/startup-guide-logo.svg';

const StyledDiv = styled.div`
  width: 100vw;
  height: 93px;
  position: static;
  top: 0;
  left: 0;
  z-index: 10;
  display: grid;
  grid-template-columns: 200px 1fr 300px;

  .aim {
    width: 200px;
    background-color: ${({ theme }) => theme.colors.primary};
    display: grid;
    align-content: center;
  }

  .main {
    display: flex;
    align-items: center;
    padding: 1rem 2rem 1rem 4rem;
  }

  .main-header {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    font-size: 1rem;
    font-style: normal;
    font-weight: 300;
    padding-left: 30px;
  }

  .button {
    background-color: ${({ theme }) => theme.colors.base.darkBG};
    color: ${({ theme }) => theme.colors.text.lighter};
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1rem;
    font-weight: 500;
    text-transform: uppercase;
  }
`;

function Header() {
  return (
    <StyledDiv>
      <div className="aim">
        <Image
          className="aim-logo"
          src={aimLogo}
          alt="Лого Агенства Инноваций Москвы"
        />
      </div>
      <div className="main">
        <Link href="/">
          <a>
            <Image className="main-logo" src={startupLogo} alt="Логотип" />
          </a>
        </Link>
        <Link href="/">
          <a>
            <h1 className="main-header">
              <span>Навигатор по</span>
              <span>стартап-экосистеме Москвы</span>
            </h1>
          </a>
        </Link>
      </div>
      <div className="button">Личный кабинет</div>
    </StyledDiv>
  );
}

export default Header;
