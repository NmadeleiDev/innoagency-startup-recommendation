import styled from 'styled-components';

const StyledLoader = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  & .loader-header {
    font-size: 1rem;
  }

  .loader {
    display: inline-block;
    position: relative;
    height: 50px;
    width: 80px;

    & div {
      position: absolute;
      top: 33px;
      width: 13px;
      height: 13px;
      border-radius: 50%;
      background: ${({ theme }) => theme.colors.base.darkerBG};
      animation-timing-function: cubic-bezier(0, 1, 1, 0);
    }
    & div:nth-child(1) {
      left: 8px;
      animation: lds-ellipsis1 0.6s infinite;
    }
    & div:nth-child(2) {
      left: 8px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    & div:nth-child(3) {
      left: 32px;
      animation: lds-ellipsis2 0.6s infinite;
    }
    & div:nth-child(4) {
      left: 56px;
      animation: lds-ellipsis3 0.6s infinite;
    }
    @keyframes lds-ellipsis1 {
      0% {
        transform: scale(0);
      }
      100% {
        transform: scale(1);
      }
    }
    @keyframes lds-ellipsis3 {
      0% {
        transform: scale(1);
      }
      100% {
        transform: scale(0);
      }
    }
    @keyframes lds-ellipsis2 {
      0% {
        transform: translate(0, 0);
      }
      100% {
        transform: translate(24px, 0);
      }
    }
  }
`;

interface LoaderProps {
  text?: string;
}

const Loader = ({ text }: LoaderProps) => {
  return (
    <StyledLoader>
      <div className="loader">
        <div />
        <div />
        <div />
        <div />
      </div>
      <span className="loader-header">{text}</span>
    </StyledLoader>
  );
};

export default Loader;
