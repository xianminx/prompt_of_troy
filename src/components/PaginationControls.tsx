import React from 'react';

interface PaginationControlsProps {
  page: number;
  totalPages: number;
  onPageChange: (newPage: number) => void;
}

const PaginationControls: React.FC<PaginationControlsProps> = ({
  page,
  totalPages,
  onPageChange,
}) => {
  return (
    <div className="flex items-center justify-center gap-4 px-4 py-3 mt-4">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md min-w-[100px] justify-center
          ${page === 1 
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'}`}
      >
        Previous
      </button>
      <span className="text-sm text-gray-700 min-w-[120px] text-center">
        Page {page} of {totalPages}
      </span>
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md min-w-[100px] justify-center
          ${page === totalPages
            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
            : 'bg-white text-gray-700 hover:bg-gray-50'}`}
      >
        Next
      </button>
    </div>
  );
};

export default PaginationControls; 