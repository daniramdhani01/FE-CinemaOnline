import React from 'react';
import { Spinner, Container } from 'react-bootstrap';

// Loading Skeleton untuk Film Card
export const FilmCardSkeleton = () => (
  <div className="col-2 p-2" style={{ height: 225 }}>
    <div className="skeleton-film-card rounded w-100 h-100 d-flex align-items-center justify-content-center">
      <Spinner animation="border" variant="light" size="sm" />
    </div>
  </div>
);

// Loading Skeleton untuk Film List (6 cards)
export const FilmListSkeleton = () => (
  <Container className="mt-3 d-flex flex-wrap">
    {Array.from({ length: 6 }).map((_, index) => (
      <FilmCardSkeleton key={index} />
    ))}
  </Container>
);

// Loading Skeleton untuk Hero Section
export const HeroSkeleton = () => (
  <div className="poster-container my-4 d-flex justify-content-center">
    <div className="skeleton-hero rounded d-flex align-items-center justify-content-center" style={{ width: 1000, height: 370 }}>
      <div className="text-center">
        <Spinner animation="border" variant="light" className="mb-3" />
        <div className="skeleton-text">Loading film...</div>
      </div>
    </div>
  </div>
);

// Loading Skeleton untuk Detail Film
export const DetailFilmSkeleton = () => (
  <div className='d-flex mt-5'>
    <div className='col-3'>
      <div className="skeleton-detail-thumbnail rounded img-fluid w-100" style={{ height: 400 }} />
    </div>
    <div className='col-9 ps-5'>
      <div className="skeleton-title mb-3" />
      <div className="skeleton-player rounded mb-3" style={{ height: 350 }} />
      <div className="skeleton-category mb-2" />
      <div className="skeleton-price mb-3" />
      <div className="skeleton-description" />
    </div>
  </div>
);

// Loading Skeleton untuk Profile
export const ProfileSkeleton = () => (
  <div className='d-flex mt-5' style={{ paddingLeft: '7.5%', paddingRight: '7.5%' }}>
    <div className='col-7'>
      <div className='fs-36 fw-bold mb-4'>My Profile</div>
      <div className='d-flex mt-4'>
        <div className="skeleton-profile-image rounded" style={{ width: 200, height: 200 }} />
        <div className='ps-4 flex-grow-1'>
          <div className="skeleton-text-line mb-3" />
          <div className="skeleton-text-line mb-3" />
          <div className="skeleton-text-line mb-3" />
          <div className="skeleton-text-line mb-3" />
          <div className="skeleton-text-line mb-3" />
          <div className="skeleton-text-line" />
        </div>
      </div>
    </div>
    <div className='w-100'>
      <div className='fs-36 fw-bold mb-4'>History Transaction</div>
      {Array.from({ length: 3 }).map((_, index) => (
        <div className="skeleton-transaction rounded p-3 mb-3" key={index} />
      ))}
    </div>
  </div>
);

// Loading Skeleton untuk Transaction Cards
export const TransactionSkeleton = () => (
  <div className="skeleton-transaction rounded p-3 mb-3">
    <div className="skeleton-text-line mb-2" />
    <div className="skeleton-text-sm mb-2" />
    <div className="d-flex justify-content-between">
      <div className="skeleton-text-sm" style={{ width: '60%' }} />
      <div className="skeleton-status" />
    </div>
  </div>
);

// Loading Skeleton untuk Table
export const TableSkeleton = ({ rows = 5, columns = 4 }) => (
  <div className="table-skeleton">
    {Array.from({ length: rows }).map((_, rowIndex) => (
      <div className="skeleton-table-row d-flex p-3 border-bottom" key={rowIndex}>
        {Array.from({ length: columns }).map((_, colIndex) => (
          <div className="skeleton-table-cell" style={{ flex: 1 }} key={colIndex}>
            <div className="skeleton-text-sm" />
          </div>
        ))}
      </div>
    ))}
  </div>
);

const LoadingSkeletonComponents = {
  FilmCardSkeleton,
  FilmListSkeleton,
  HeroSkeleton,
  DetailFilmSkeleton,
  ProfileSkeleton,
  TransactionSkeleton,
  TableSkeleton
};

export default LoadingSkeletonComponents;