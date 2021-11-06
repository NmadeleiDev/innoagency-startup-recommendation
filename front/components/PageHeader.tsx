import styled from 'styled-components';
import { useRouter } from 'next/dist/client/router';
import { BackIcon } from 'components/Icon';
import theme from 'styles/theme';
import { FC } from 'react';

interface Props {
  title?: string;
  className?: string;
  handleBack?: () => void;
}

const StyledDiv = styled.div`
  margin: 1rem 0;
  position: relative;

  h2 {
    margin: 0;
    padding: 0;
    text-align: center;
    text-transform: uppercase;
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

  .header {
    max-width: 60%;
    margin: 0 auto;

    a {
      color: ${({ theme }) => theme.colors.primary};
      text-decoration: underline;
    }
  }
`;

const PageHeader: FC<Props> = ({ title, className, handleBack, children }) => {
  const router = useRouter();
  const isHomePage = router.pathname === '/';
  const handleBackDefault = () => {
    router.back();
  };
  return (
    <StyledDiv className={className}>
      {!isHomePage && (
        <BackIcon
          color={theme.colors.base.darkBG}
          className="back"
          onClick={handleBack || handleBackDefault}
        />
      )}
      <h2 className="header">{children ? children : title}</h2>
    </StyledDiv>
  );
};

export default PageHeader;
