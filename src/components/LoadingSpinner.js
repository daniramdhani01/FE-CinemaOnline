import React from 'react';
import { Spinner, Modal } from 'react-bootstrap';
import '../style/style.css';

// Global Loading Overlay untuk halaman transisi
export const GlobalLoading = ({ show = false }) => (
  <Modal
    show={show}
    centered
    backdrop="static"
    keyboard={false}
    contentClassName="bg-transparent border-0"
  >
    <Modal.Body className="d-flex flex-column align-items-center justify-content-center">
      <Spinner animation="border" variant="light" style={{ width: '3rem', height: '3rem' }} />
      <div className="text-white mt-3">Loading...</div>
    </Modal.Body>
  </Modal>
);

// Inline Loading Spinner
export const InlineSpinner = ({ size = 'sm', variant = 'light', text = null }) => (
  <div className="d-flex align-items-center justify-content-center">
    <Spinner animation="border" size={size} variant={variant} />
    {text && <span className="ms-2">{text}</span>}
  </div>
);

// Button Loading Spinner
export const ButtonSpinner = ({ isLoading, children, ...props }) => (
  <button
    {...props}
    disabled={isLoading || props.disabled}
    className={props.className}
    type={props.type || 'button'}
  >
    {isLoading ? (
      <>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
          className="me-2"
        />
        Processing...
      </>
    ) : (
      children
    )}
  </button>
);

// Page Loading untuk saat data sedang dimuat
export const PageLoading = ({ message = "Loading..." }) => (
  <div
    className="d-flex flex-column align-items-center justify-content-center"
    style={{ height: "80vh" }}
  >
    <Spinner animation="border" variant="light" style={{ width: '3rem', height: '3rem' }} />
    <div className="text-white mt-3 fs-5">{message}</div>
  </div>
);

// Custom Loading dengan tema pink aplikasi
export const PinkSpinner = ({ size = 'md', text = null }) => {
  const sizeClass = {
    sm: { width: '1rem', height: '1rem' },
    md: { width: '2rem', height: '2rem' },
    lg: { width: '3rem', height: '3rem' }
  }[size] || { width: '2rem', height: '2rem' };

  return (
    <div className="d-flex flex-column align-items-center">
      <div
        className="spinner-border text-pink"
        role="status"
        style={sizeClass}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {text && <div className="text-white mt-2">{text}</div>}
    </div>
  );
};

// Loading Card Component
export const LoadingCard = ({ title, children }) => (
  <div className="loading-card p-4 rounded text-center">
    <PinkSpinner size="lg" text={title} />
    {children}
  </div>
);

const LoadingSpinnerComponents = {
  GlobalLoading,
  InlineSpinner,
  ButtonSpinner,
  PageLoading,
  PinkSpinner,
  LoadingCard
};

export default LoadingSpinnerComponents;