import styled from 'styled-components';

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 1fr 100px 130px;
  align-items: center;
  grid-gap: 1rem;
  height: 70px;
  padding: 0 2rem;
  max-width: 1000px;
  margin: 0 auto;
  border-bottom: 1px solid ${({ theme }) => theme.colors.base.border};
  cursor: default;

  .title,
  .type,
  .score {
    display: inline-block;
    text-align: center;
  }

  .title {
    text-align: left;
  }

  .metrics {
    display: none;
  }

  @media (min-width: 800px) {
    padding-top: 1rem;
    padding-bottom: 1rem;
    grid-template-columns: 1fr 100px 130px 200px;

    .metrics {
      display: inline-block;
      text-align: center;
    }
  }
  @media (min-width: 1200px) {
    height: 120px;
    grid-gap: 2rem;
  }
  .image {
    width: 100px;
  }
`;

interface Props {
  item: {
    name: string;
    type: string;
    score: string;
    metrics: string;
  };
}

const ListHeader = ({ item }: Props) => {
  return (
    <Wrapper>
      <div className="title">{item.name}</div>
      <div className="score">{item.score}</div>
      <div className="type">{item.type}</div>
      <div className="metrics">{item.metrics}</div>
    </Wrapper>
  );
};

export default ListHeader;
