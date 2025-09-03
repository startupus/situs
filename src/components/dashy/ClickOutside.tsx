import { useRef, useEffect, ReactNode } from 'react';
import PropTypes from 'prop-types';

interface ClickOutsideProps {
  children: ReactNode;
  exceptionRef?: React.RefObject<Element>;
  onClick: () => void;
  className?: string;
}

const ClickOutside = ({ children, exceptionRef, onClick, className }: ClickOutsideProps) => {
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener('mousedown', handleClickListener);

    return () => {
      document.removeEventListener('mousedown', handleClickListener);
    };
  });

  const handleClickListener = (event: MouseEvent) => {
    let clickedInside;
    if (exceptionRef && exceptionRef.current) {
      clickedInside =
        (wrapperRef.current && wrapperRef.current.contains(event.target as Node)) ||
        exceptionRef.current === event.target ||
        exceptionRef.current.contains(event.target as Node);
    } else {
      clickedInside = wrapperRef.current && wrapperRef.current.contains(event.target as Node);
    }

    if (clickedInside) return;
    else onClick();
  };

  return (
    <div ref={wrapperRef} className={`${className || ''}`}>
      {children}
    </div>
  );
};

ClickOutside.propTypes = {
  children: PropTypes.node.isRequired,
  exceptionRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  onClick: PropTypes.func.isRequired,
  className: PropTypes.string,
};

export default ClickOutside;
