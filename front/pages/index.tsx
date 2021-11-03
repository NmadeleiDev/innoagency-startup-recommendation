import type { NextPage } from 'next';
import Link from 'next/link';
import styled from 'styled-components';
import Button from 'components/Button';
import PageHeader from 'components/PageHeader';
import { useAppDispatch } from 'store/store';
import {
  getCompanies,
  getCompanyById,
  getCompanyByINN,
  getRandomCompany,
} from 'store/features/user';
import Input from 'components/Input';
import { ChangeEvent, useState } from 'react';
import { useRouter } from 'next/dist/client/router';
import { isINN } from './list';

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
  }
`;

const Home: NextPage = () => {
  const [value, setValue] = useState('');
  const router = useRouter();
  const dispatch = useAppDispatch();
  const getСomp = () => {
    if (isINN(value)) dispatch(getCompanyByINN(value));
    else dispatch(getCompanyById(value));
    router.push(`/list?id=${value}`);
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  return (
    <StyledDiv>
      <PageHeader title="Домашнаяя страница" />
      <Link href="/companyInfo">
        <a>
          <Button className="item">Заполнить анкету</Button>
        </a>
      </Link>
      <div className="login">
        <Input
          className="item input"
          onChange={handleChange}
          value={value}
          nolabel
          placeholder="Введите ИНН стратапа"
        />
        <Button className="item" variant="secondary" onClick={getСomp}>
          Получить рекомендацию
        </Button>
      </div>
    </StyledDiv>
  );
};

export default Home;
