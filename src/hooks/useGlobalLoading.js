import { useState, useEffect } from 'react';

// Hook untuk mengelola global loading state
export const useGlobalLoading = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('Loading...');

  const showLoading = (msg = 'Loading...') => {
    setMessage(msg);
    setIsLoading(true);
  };

  const hideLoading = () => {
    setIsLoading(false);
  };

  return {
    isLoading,
    message,
    showLoading,
    hideLoading
  };
};

export default useGlobalLoading;