import Link from 'next/link';

interface Props {
  href: string;
  className?: string;
}

const NextLink: React.FC<Props> = ({ href, className, children }) => {
  return (
    <Link href={href}>
      <a className={className}>{children}</a>
    </Link>
  );
};

export default NextLink;
