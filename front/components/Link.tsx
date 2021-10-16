import Link from 'next/link';

interface Props {
  href: string;
}

const NextLink: React.FC<Props> = ({ href, children }) => {
  return (
    <Link href={href}>
      <a>{children}</a>
    </Link>
  );
};

export default NextLink;
