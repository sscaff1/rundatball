import { useState, useEffect } from 'react';

const useMobileSize = () => {
  const [isMobile, setIsMobile] = useState(undefined);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 420);
    };
    window.addEventListener('resize', handleResize);
    handleResize();
    return () => window.removeEventListener('resize', handleResize);
  }, []); // Empty array ensures that effect is only run on mount
  return isMobile;
};

export default useMobileSize;
