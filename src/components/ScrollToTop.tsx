import { useEffect, useState } from 'react';

const ScrollToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const currentScrollPos = window.pageYOffset;
    setIsVisible(currentScrollPos > 100); //
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <button
      className={`fixed bottom-4 right-4 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      } rounded-full p-3 text-white shadow-lg transition-opacity duration-300`}
      style={{ backgroundColor: '#4442E3' }}
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <i className="fa-solid fa-chevron-up text-xl text-white"></i>
    </button>
  );
};

export default ScrollToTopButton;
