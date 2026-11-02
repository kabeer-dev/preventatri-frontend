import NextLink from 'next/link';

import {LocaleLinkProps} from '@/shared/interfaces/utils';

const Link = ({href, ...props}: LocaleLinkProps) => (
  <NextLink href={href} {...props} />
);

export default Link;
