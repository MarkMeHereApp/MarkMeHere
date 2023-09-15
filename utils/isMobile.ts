import { useEffect, useState } from 'react';

const isMobile = () => {
  const [width, setWidth] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth;
    }
    // Return a default value if window is not defined (for SSR)
    return 769;
  });

  useEffect(() => {
    const handleWindowSizeChange = () => {
      setWidth(window.innerWidth);
    };

    if (typeof window !== 'undefined') {
      window.addEventListener('resize', handleWindowSizeChange);

      return () => {
        window.removeEventListener('resize', handleWindowSizeChange);
      };
    }
  }, []);

  return width <= 768;
};

export default isMobile;
