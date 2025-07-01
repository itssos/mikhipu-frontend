
import React from 'react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

const EditButton = ({ onClick, className = '', ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`hover:scale-110 cursor-pointer shadow-sm shadow-black transition-normal duration-300 rounded ${className}`}
      {...props}
    >
     ✏️
    </button>
  );
};

export default EditButton;
