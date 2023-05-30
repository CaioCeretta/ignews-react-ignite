import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/router';
import { ReactElement } from 'react';

interface IActiveLinkProps extends LinkProps {
  children: React.ReactNode;
  activeClassName: string;
}

export function ActiveLink({children, activeClassName, ...rest}: IActiveLinkProps) {
  const { asPath } = useRouter();

  const className = asPath === rest.href
    ? activeClassName
    : '';

  return (
    <Link className={className} {...rest}>
      {children}
    </Link>
  )
}