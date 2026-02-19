import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const ScrollToTop = () => {
  // Access the current location (URL path)
  const { pathname } = useLocation();

  useEffect(() => {
    // Whenever the pathname changes (user navigates), 
    // scroll the window to the very top immediately.
    window.scrollTo(0, 0);
  }, [pathname]);

  // This component doesn't render anything visually
  return null;
};

export default ScrollToTop; 