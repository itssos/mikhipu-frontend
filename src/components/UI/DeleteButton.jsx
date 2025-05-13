
import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

const DeleteButton = ({ onClick, className = '', ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`hover:scale-110 cursor-pointer shadow-sm shadow-black transition-normal duration-300 rounded ${className}`}
      {...props}
    >
      <TrashIcon className="text-red-500 cursor-pointer" />
    </button>
  );
};

export default DeleteButton;
