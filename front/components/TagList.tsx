import styled from 'styled-components';

const TagListWrapper = styled.ul`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  .item {
    padding: 10px;
    border: ${({ theme }) => `1px solid ${theme.colors.base.darkBG}`};
    color: ${({ theme }) => theme.colors.base.darkBG};
  }
`;
interface TagListProps {
  tags?: string[];
}
const TagList = ({ tags }: TagListProps) => {
  return tags ? (
    <TagListWrapper>
      {tags.map((tag) => (
        <li key={tag} className="item">
          {tag}
        </li>
      ))}
    </TagListWrapper>
  ) : null;
};

export default TagList;
