import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

const RedirectHandler = () => {
  const { code } = useParams();

  useEffect(() => {
    // This sends the user straight to the backend redirect route
    window.location.href = `https://backend-8bxo.onrender.com/api/URLs/go/${code}`;
  }, [code]);

  return <p>Redirecting you now...</p>;
};

export default RedirectHandler;