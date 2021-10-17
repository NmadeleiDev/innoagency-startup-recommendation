import { useState } from 'react';
import styled from 'styled-components';
import {
  ArrowBoxIcon,
  BurgerIcon,
  ConnectIcon,
  HouseIcon,
  LayersIcon,
  LeavesIcon,
  PlaneIcon,
  RoomIcon,
  StairsIcon,
  WrenchIcon,
} from './Icon';

const StyledDiv = styled.div`
  .burger-button {
    display: block;
    margin: 1rem;
  }

  .list {
    display: none;

    .item {
      display: flex;
      align-items: center;
      margin: 1rem 0;
    }

    .text {
      display: block;
      margin-left: 1rem;
      text-transform: uppercase;
      margin-left: 1rem;
      font-weight: 300;
    }
  }

  .show {
    padding: 10px;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
  }

  @media (min-width: 400px) {
    .list {
      padding: 10px;
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      justify-content: center;
    }

    .burger-button {
      display: none;
    }
  }

  @media (min-width: 700px) {
    padding: 1rem;
  }
`;

interface Props {
  className?: string;
}
interface IMenuItem {
  text: string;
  icon: JSX.Element;
  link: string;
}

const menu: IMenuItem[] = [
  {
    text: 'Стартапы и тех. компании',
    icon: <ArrowBoxIcon />,
    link: '/',
  },
  {
    text: 'Корпорации',
    icon: <ConnectIcon />,
    link: '/',
  },
  {
    text: 'Венчурные фонды',
    icon: <LayersIcon />,
    link: '/',
  },
  {
    text: 'Акселераторы',
    icon: <StairsIcon />,
    link: '/',
  },
  {
    text: 'Бизнес-инкубаторы',
    icon: <LeavesIcon />,
    link: '/',
  },
  {
    text: 'Институты развития',
    icon: <HouseIcon />,
    link: '/',
  },
  {
    text: 'Инжиниринговые центры',
    icon: <WrenchIcon />,
    link: '/',
  },
  {
    text: 'Коворкинги и офисы',
    icon: <RoomIcon />,
    link: '/',
  },
  {
    text: 'Площадки пилотного тестирования',
    icon: <PlaneIcon />,
    link: '/',
  },
];

const Sidebar = ({ className }: Props) => {
  const [show, setShow] = useState(false);

  const handleToggleShow = () => {
    setShow((state) => !state);
  };

  return (
    <StyledDiv className={className}>
      <BurgerIcon onClick={handleToggleShow} className="burger-button" />
      <div className={show ? 'list show' : 'list'}>
        {menu.map((item) => (
          <div key={item.text} className="item">
            {item.icon}
            <span className="text">{item.text}</span>
          </div>
        ))}
      </div>
    </StyledDiv>
  );
};

export default Sidebar;
