
import React from 'react';
import { UserPlusIcon } from '@heroicons/react/24/outline';

const AddPersonButton = ({ onClick, className = '', ...props }) => {
  return (
    <button
      onClick={onClick}
      className={`hover:scale-110 cursor-pointer shadow-sm shadow-black transition-normal duration-300 p-1 w-10 h-10 rounded ${className}`}
      {...props}
    >
      <UserPlusIcon className="text-blue-500 cursor-pointer" />
    </button>
  );
};

export default AddPersonButton;
