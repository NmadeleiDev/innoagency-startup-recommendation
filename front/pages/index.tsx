import { ChangeEvent, FormEvent, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import Link from 'next/link';
import type { NextPage } from 'next';
import styled from 'styled-components';

import { useAppDispatch, useAppSelector } from 'store/store';
import { getCompanyByINN } from 'store/features/user';
import Button from 'components/Button';
import PageHeader from 'components/PageHeader';
import Input from 'components/Input';
import Loader from 'components/Loader';

const StyledDiv = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem;

  .item {
    min-width: 300px;
  }

  .input {
    margin-left: 0;
    margin-right: 0;
  }

  .login {
    margin-top: 3rem;
    text-align: center;

    .header {
      text-align: center;
      font-size: 1.5rem;
      margin-bottom: 0.5rem;

      .name {
        text-transform: uppercase;
      }
    }

    .secondary {
      .input {
        background-color: ${({ theme }) => theme.colors.base.darkBG};
      }
    }

    .hidden {
      display: none;
    }
  }
`;

const Home: NextPage = () => {
  const user = useAppSelector((state) => state.user.user);
  const [loading, setLoading] = useState(false);
  const [value, setValue] = useState(user.inn);
  const router = useRouter();
  const dispatch = useAppDispatch();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    console.log(e.currentTarget.enterKeyHint);
    setValue(e.target.value);
  };

  const handleEnter = (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    dispatch(getCompanyByINN(value));
    router.push(`/list?inn=${value}`);
  };

  const loginForm = (
    <form className="login" onSubmit={handleEnter}>
      {user.inn === '' ? (
        <>
          <div className="header">или</div>
          <Input
            // hide input if already logged in
            className={`item input ${user.inn === '' ? '' : 'hidden'}`}
            onChange={handleChange}
            value={value}
            nolabel
            placeholder="Введите ИНН стратапа"
          />
        </>
      ) : (
        <div className="header">
          Вы вошли как <span className="name">{user.name}</span>
        </div>
      )}
      {loading ? (
        <Loader />
      ) : (
        <Button variant="secondary" className="item">
          Получить рекомендации
        </Button>
      )}
    </form>
  );

  return (
    <StyledDiv>
      <PageHeader title="Домашнаяя страница" />
      {user.inn === '' && (
        <Link href="/companyInfo">
          <a>
            <Button className="item">Заполнить анкету</Button>
          </a>
        </Link>
      )}
      {loginForm}
    </StyledDiv>
  );
};

export default Home;
