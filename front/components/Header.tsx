import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styled from 'styled-components';
import startupLogo from 'public/startup-guide-logo.svg';
import { AimIcon } from './Icon';
import Button from './Button';

const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: 350px 1fr;

  .aim {
    background-color: ${({ theme }) => theme.colors.primary};
    display: grid;
    align-content: center;
    padding: 1.5rem;
  }

  .header-main {
    display: none;
  }

  .header-logo {
    display: flex;
  }

  @media (min-width: 770px) {
    grid-template-columns: 300px 1fr 300px;
    .header-main {
      display: flex;
      flex-direction: column;
      justify-content: flex-start;
      padding: 1rem;
    }

    .header-title {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      font-size: 1rem;
      font-style: normal;
      font-weight: 300;
    }
  }

  @media (min-width: 1200px) {
    .header-main {
      flex-direction: row;
      align-items: center;
    }

    .header-title {
      justify-content: center;
      padding-left: 30px;
    }
  }
`;

interface Props {
  className?: string;
}

const Header = ({ className }: Props) => {
  return (
    <StyledDiv className={className}>
      <div className="aim">
        <AimIcon width={230} height={100} className="aim-logo" />
      </div>
      <Link href="/">
        <a className="header-main">
          <div className="header-logo">
            <Image src={startupLogo} alt="Логотип" />
          </div>
          <h1 className="header-title">
            <span>Навигатор по</span>
            <span>стартап-экосистеме Москвы</span>
          </h1>
        </a>
      </Link>
      <Button variant="secondary">Личный кабинет</Button>
    </StyledDiv>
  );
};

export default Header;
