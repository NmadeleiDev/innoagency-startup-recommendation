import styled from 'styled-components';
import Image from 'next/image';
import Input from 'components/Input';
import Button from 'components/Button';
import PageHeader from 'components/PageHeader';
import { useRouter } from 'next/dist/client/router';

const StyledDiv = styled.div`
  padding: 1rem 0;

  .page-header {
    grid-area: header;
  }

  .col1 {
    margin: 0 1rem;
    grid-area: col1;
  }

  .col2 {
    margin: 0 1rem;
    grid-area: col2;
  }

  .favorites {
    grid-area: favorites;
  }

  .button {
    grid-area: button;
  }

  display: grid;
  grid-row-gap: 1rem;
  grid-template-areas:
    'header'
    'col1'
    'col2'
    'button'
    'favorites';

  .button {
    display: flex;
    justify-content: center;
  }

  .favorites {
    display: flex;
    flex-direction: column;
    margin: 2rem 2rem 0;
    /* max-width: 600px; */

    .image {
      height: 15rem;
      width: 15rem;
      margin-right: 1rem;
    }

    .favorites-header {
      font-weight: 700;
      font-size: 1.3rem;
      text-transform: uppercase;
    }

    .favorites-list {
      display: flex;
      flex-wrap: wrap;
      /* flex-wrap: nowrap; */
      /* overflow: scroll; */
      /* max-width: 900px; */
    }
  }

  @media (min-width: 700px) {
    grid-template-areas:
      'header header'
      'col1 col2'
      'button button'
      'favorites favorites';
  }
`;

const faves = [
  {
    id: 1,
    logo: '/Tech21.png',
  },
  {
    id: 2,
    logo: '/TechPowerup.png',
  },
  {
    id: 3,
    logo: '/TomsHardware.png',
  },
  {
    id: 4,
    logo: '/FerroTec.png',
  },
  {
    id: 5,
    logo: '/Tech21.png',
  },
  {
    id: 6,
    logo: '/TechPowerup.png',
  },
];

const Personal = () => {
  const router = useRouter();

  const handleSave = () => {
    router.back();
  };
  return (
    <StyledDiv>
      <PageHeader title="Личный кабинет" className="page-header" />
      <div className="col1">
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
      </div>
      <div className="col2">
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
        <Input placeholder="Поле ввода" />
      </div>
      <div className="button">
        <Button variant="secondary" onClick={handleSave}>
          Сохранить
        </Button>
      </div>
      <div className="favorites">
        <div className="favorites-header">Избранное</div>
        <div className="favorites-list">
          {faves.map((fave) => (
            <div key={fave.id} className="image">
              <Image src={fave.logo} width={350} height={350} alt="" />
            </div>
          ))}
        </div>
      </div>
    </StyledDiv>
  );
};

export default Personal;
