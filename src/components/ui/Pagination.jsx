import React from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  if (totalPages <= 1) {
    return null; // Don't render pagination if there's only one page
  }

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  return (
    <div className="flex items-center justify-center space-x-4 mt-6">
      <button
        onClick={handlePrevious}
        disabled={currentPage === 1}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <FaChevronLeft className="mr-2" />
        Previous
      </button>

      <span className="text-sm text-gray-700">
        Page <span className="font-bold">{currentPage}</span> of{" "}
        <span className="font-bold">{totalPages}</span>
      </span>

      <button
        onClick={handleNext}
        disabled={currentPage === totalPages}
        className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
        <FaChevronRight className="ml-2" />
      </button>
    </div>
  );
};

export default Pagination;
