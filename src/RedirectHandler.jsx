// Import React useEffect hook for side effects
import { useEffect } from 'react';
// Import useParams hook to extract URL parameters
import { useParams } from 'react-router-dom';

// RedirectHandler component handles the redirect when a short code is accessed
const RedirectHandler = () => {
  // Extract the 'code' parameter from the URL (e.g., /r/:code)
  const { code } = useParams();

  // useEffect hook runs when the component mounts or when 'code' changes
  useEffect(() => {
    // Redirect the user to the backend's redirect endpoint with the short code
    // This will handle the actual redirection to the original long URL
    window.location.href = `https://backend-8bxo.onrender.com/api/URLs/go/${code}`;
  }, [code]);

  // Display a message while redirecting
  return <p>Redirecting you now...</p>;
};

// Export the RedirectHandler component for use in the router
export default RedirectHandler;