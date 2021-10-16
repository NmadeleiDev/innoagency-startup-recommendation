import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';
import { BackIcon } from 'components/Icon';
import theme from 'styles/theme';

interface Props {
  title: string;
  className?: string;
}

const StyledDiv = styled.div`
  margin: 1rem 2rem;
  position: relative;

  h2 {
    margin: 0;
    padding: 0;
    text-align: center;
  }

  .back {
    position: absolute;
    top: 0;
    left: 0;
    cursor: pointer;
    transition: 0.3s;
  }

  .back:hover {
    transform: scale(1.1);
  }
`;

const PageHeader = ({ title, className }: Props) => {
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  const handleBack = () => {
    router.back();
  };
  return (
    <StyledDiv className={className}>
      {!isHomePage && (
        <BackIcon
          color={theme.colors.base.darkBG}
          className="back"
          onClick={handleBack}
        />
      )}
      <h2>{title}</h2>
    </StyledDiv>
  );
};

export default PageHeader;
