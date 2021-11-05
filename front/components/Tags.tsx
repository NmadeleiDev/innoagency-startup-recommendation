import React from 'react';
import Category from './Category';
import TagList from './TagList';

interface Props {
  header: string;
  className?: string;
  tags?: string[] | null;
  nonFocus?: string[] | null;
}

const Tags = ({ header, tags, nonFocus, className }: Props) => {
  if (!tags?.length && !nonFocus?.length) return null;
  return (
    <Category header={header} className={className || ''}>
      <TagList tags={tags || []} nonFocus={nonFocus} />
    </Category>
  );
};

export default Tags;
