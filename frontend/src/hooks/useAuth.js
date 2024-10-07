import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('UserToken'); // Retrieve token from local storage
    console.log(token);
    if (!token) {
      navigate('/'); // Redirect to login page if token is not found
    }
  }, [navigate]);
};