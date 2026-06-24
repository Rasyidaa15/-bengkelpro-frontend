import React from 'react';

const Input = ({ label, error, className = '', icon, ...props }) => {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">{label}</label>}
      <div className="relative">
        {icon && <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">{icon}</span>}
        <input
          className={`w-full px-4 py-2.5 border rounded-lg transition-all duration-200 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${icon ? 'pl-10' : ''} ${error ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 dark:border-gray-700'} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;