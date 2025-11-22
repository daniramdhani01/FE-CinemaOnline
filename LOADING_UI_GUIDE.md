# Loading UI Implementation Guide

## Overview

This guide explains the comprehensive loading UI system implemented for the Cinema Online application. The system provides various loading states and skeleton components to enhance user experience during data fetching and operations.

## Components Created

### 1. Loading Skeleton Components (`src/components/LoadingSkeleton.js`)

#### Available Skeleton Components:

- **FilmCardSkeleton** - For individual film cards in grid layout
- **FilmListSkeleton** - For the entire film list (6 cards)
- **HeroSkeleton** - For the main hero section on landing page
- **DetailFilmSkeleton** - For film detail page layout
- **ProfileSkeleton** - For user profile page
- **TransactionSkeleton** - For transaction history items
- **TableSkeleton** - For tabular data with customizable rows and columns

#### Usage Example:
```javascript
import { FilmCardSkeleton, ProfileSkeleton, PageLoading } from '../components/LoadingSkeleton';

// For loading states
{isLoading ? <ProfileSkeleton /> : <ProfileContent />}

// For page-level loading
{isLoadingFilms ? <PageLoading message="Loading films..." /> : <FilmGrid />}
```

### 2. Loading Spinner Components (`src/components/LoadingSpinner.js`)

#### Available Spinner Components:

- **GlobalLoading** - Full-screen modal loading overlay
- **InlineSpinner** - Small inline spinner with optional text
- **ButtonSpinner** - Button with integrated loading state
- **PageLoading** - Full-page loading component
- **PinkSpinner** - Custom pink-themed spinner matching app design
- **LoadingCard** - Card container with centered loading spinner

#### Usage Example:
```javascript
import { ButtonSpinner, PinkSpinner, PageLoading } from '../components/LoadingSpinner';

// Button with loading state
<ButtonSpinner
  isLoading={isSubmitting}
  className="btn-pink"
  onClick={handleSubmit}
>
  Submit Form
</ButtonSpinner>

// Page loading
<PageLoading message="Loading your data..." />

// Custom pink spinner
<PinkSpinner size="lg" text="Processing payment..." />
```

### 3. Loading Context (`src/context/LoadingContext.js`)

Global loading state management system:

```javascript
import { LoadingProvider, useLoading } from '../context/LoadingContext';

// Wrap your app with LoadingProvider
<LoadingProvider>
  <App />
</LoadingProvider>

// Use in any component
const { isLoading, showLoading, hideLoading } = useLoading();

// Show global loading
showLoading('Processing your request...');
// Hide loading
hideLoading();
```

## CSS Styles Added

### Skeleton Animation (`src/style/style.css`)

Added comprehensive skeleton loading styles with gradient animations:

```css
.skeleton-film-card {
    background: linear-gradient(90deg, #2a2a2a 25%, #3a3a3a 50%, #2a2a2a 75%);
    background-size: 200% 100%;
    animation: skeleton-loading 1.5s infinite;
}

@keyframes skeleton-loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
}
```

### Button Loading States

```css
.btn-loading:disabled {
    opacity: 0.7;
    cursor: not-allowed;
}

.spinner-border.text-pink {
    border-color: #CD2E71;
    border-right-color: transparent;
}
```

## Integration in Existing Components

### 1. Landing Page (`src/page/LandingPage.js`)

- Added loading state for film fetching
- Integrated PageLoading component
- Improved user experience during data loading

### 2. Detail Film (`src/page/DetailFIlm.js`)

- Added loading state for film details
- Implemented PageLoading component
- Enhanced delete button loading state

### 3. Profile (`src/page/Profile.js`)

- Added skeleton loading for profile data
- Implemented transaction list loading
- Added empty state handling

### 4. Login, Register, Buy Components

- Enhanced all form buttons with loading states
- Added spinner indicators during API calls
- Improved form submission UX

## Best Practices

### 1. Loading States

- Always show loading for API calls longer than 200ms
- Use skeleton screens for content that loads regularly
- Provide meaningful loading messages
- Maintain consistent loading patterns

### 2. Skeleton Usage

```javascript
// Good: Show skeleton for specific content
{isLoadingProfile ? (
  <ProfileSkeleton />
) : (
  <ProfileContent />
)}

// Good: Multiple skeletons for lists
{isLoadingTransactions ? (
  <>
    {Array.from({ length: 3 }).map((_, index) => (
      <TransactionSkeleton key={index} />
    ))}
  </>
) : (
  <TransactionList />
)}
```

### 3. Button Loading

```javascript
// Good: Button with integrated loading
<Button
  type="submit"
  disabled={isLoading}
  className="btn-pink"
>
  {isLoading ? (
    <>
      <Spinner as="span" animation="border" size="sm" className="me-2" />
      Processing...
    </>
  ) : (
    'Submit'
  )}
</Button>
```

### 4. Page-Level Loading

```javascript
// Good: Page loading for initial data fetch
{isLoading ? (
  <PageLoading message="Loading your dashboard..." />
) : (
  <DashboardContent />
)}
```

## Benefits

1. **Improved User Experience** - Users see visual feedback during loading
2. **Reduced Perceived Performance** - Skeleton screens make app feel faster
3. **Consistent Design** - All loading states follow the same design patterns
4. **Accessibility** - Proper ARIA attributes and semantic HTML
5. **Maintainable Code** - Reusable components and consistent patterns

## Future Enhancements

1. **React Suspense Integration** - Implement React 18 concurrent features
2. **Error Boundaries** - Add error handling for failed requests
3. **Progress Indicators** - Add progress bars for long-running operations
4. **Caching Indicators** - Show when data is being refreshed from cache
5. **Optimistic Updates** - Show immediate UI feedback before API response

## Testing Recommendations

1. Test loading states with slow network conditions
2. Verify skeleton layouts match final content layouts
3. Ensure loading states are properly accessible
4. Test loading states during error conditions
5. Verify performance impact of loading animations

## Files Modified/Created

### New Files:
- `src/components/LoadingSkeleton.js`
- `src/components/LoadingSpinner.js`
- `src/context/LoadingContext.js`
- `src/hooks/useGlobalLoading.js`

### Modified Files:
- `src/style/style.css` - Added loading styles and animations
- `src/page/LandingPage.js` - Added loading states
- `src/page/DetailFIlm.js` - Added loading states
- `src/page/Profile.js` - Added skeleton loading
- `src/components/Login.js` - Added button loading
- `src/components/Register.js` - Added button loading
- `src/components/Buy.js` - Added button loading

This implementation provides a comprehensive loading system that significantly improves the user experience of the Cinema Online application.