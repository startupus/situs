import React from 'react';

// Next.js Head component shim для совместимости
const Head: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return <>{children}</>;
};

export default Head;
