import styled from 'styled-components';

const TagListWrapper = styled.ul`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  justify-content: center;
  padding: 2rem;

  .item {
    padding: 10px;
    border: 1px solid ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.base.darkBG};
  }

  .nonfocus {
    position: relative;
    border: 1px solid ${({ theme }) => theme.colors.base.border};
    /* color: ${({ theme }) => theme.colors.primary}; */
    .tooltip {
      display: none;
      position: absolute;
      top: 120%;
      left: 0px;
      background-color: ${({ theme }) => theme.colors.base.lightBG};
      color: ${({ theme }) => theme.colors.text.dark};
      border: 1px solid ${({ theme }) => theme.colors.base.border};
      box-shadow: 2px 2px 10px ${({ theme }) => theme.colors.base.border};
      padding: 0.5em;
      width: 200px;
      height: 60px;
      z-index: 2;
    }
    &:hover .tooltip {
      display: block;
    }
  }
`;
interface TagListProps {
  tags?: string[];
  nonFocus?: string[] | null;
}
const TagList = ({ tags, nonFocus }: TagListProps) => {
  return (
    <TagListWrapper>
      {tags?.map((tag) => (
        <li key={tag} className="item">
          {tag}
        </li>
      ))}
      {nonFocus?.map((tag) => (
        <li key={tag} className="item nonfocus">
          {tag}
          <span className="tooltip">Нетипичные категории для сервиса</span>
        </li>
      ))}
    </TagListWrapper>
  );
};

export default TagList;
