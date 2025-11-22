import React, { createContext, useContext, useState } from 'react';
import { GlobalLoading } from '../components/LoadingSpinner';

// Create context
const LoadingContext = createContext();

// Loading Provider Component
export const LoadingProvider = ({ children }) => {
  const [loadingState, setLoadingState] = useState({
    isLoading: false,
    message: 'Loading...'
  });

  const showLoading = (message = 'Loading...') => {
    setLoadingState({
      isLoading: true,
      message
    });
  };

  const hideLoading = () => {
    setLoadingState({
      isLoading: false,
      message: 'Loading...'
    });
  };

  return (
    <LoadingContext.Provider value={{
      ...loadingState,
      showLoading,
      hideLoading
    }}>
      <GlobalLoading show={loadingState.isLoading} />
      {children}
    </LoadingContext.Provider>
  );
};

// Custom hook untuk menggunakan loading context
export const useLoading = () => {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within LoadingProvider');
  }
  return context;
};

export default LoadingContext;