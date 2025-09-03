import { Link as RouterLink, useLocation } from 'react-router-dom';
import * as types from 'redaktus/types';

const NextLink: types.RenderLocalLink = ({
  href,
  // target,
  // rel,
  className,
  activeClassName,
  children,
}) => {
  const location = useLocation();

  let anchorClassName = '';

  if (location.pathname === href) {
    anchorClassName = `${className} ${activeClassName}`;
  } else {
    anchorClassName = className || '';
  }

  return (
    <RouterLink to={href} className={anchorClassName}>
      {children}
    </RouterLink>
  );
};

export default NextLink;
