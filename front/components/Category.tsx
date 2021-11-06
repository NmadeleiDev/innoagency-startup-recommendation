import { FC } from 'react';
import styled from 'styled-components';

const StyledCategory = styled.div`
  display: flex;
  flex-direction: column;
  text-align: center;

  .header {
    font-weight: 500;
    text-transform: uppercase;
  }

  .text {
    text-transform: initial;
  }
`;

interface ICategoryProps {
  header: string;
  className?: string;
}

const Category: FC<ICategoryProps> = ({ header, children, className }) => {
  return (
    <StyledCategory className={className}>
      <div className="header">{header}</div>
      <div className="text">{children}</div>
    </StyledCategory>
  );
};

export default Category;
