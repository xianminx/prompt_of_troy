import React from 'react';

interface LoadingStateProps {
  loading: boolean;
  error: string | null;
}

const LoadingState: React.FC<LoadingStateProps> = ({ loading, error }) => {
  if (loading) return <div className="text-center p-4">Loading...</div>;
  if (error) return <div className="text-red-500 p-4">Error: {error}</div>;
  return null;
};

export default LoadingState; 