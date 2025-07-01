
import React from 'react';
import { TrashIcon } from '@heroicons/react/24/outline';

const DeleteButton = ({ onClick, className = '', ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`hover:scale-110 cursor-pointer shadow-sm shadow-black transition-normal duration-300 rounded ${className}`}
      {...props}
    >
      🗑️
    </button>
  );
};

export default DeleteButton;
