import React from 'react';

const Mascot = ({ className = '', size = 'md' }) => {
  const sizes = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-32 h-32',
  };
  const sizeClass = sizes[size] || sizes.md;

  return (
    <div className={`relative inline-block ${className}`}>
      <div className="animate-bounce-slow group">
        <img
          src="/lupi.png"
          alt="Lupi"
          className={`${sizeClass} rounded-2xl object-cover shadow-2xl border-4 border-crimson-400/30 transform transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}
        />
        <div className="text-center mt-3">
          <span className="inline-block px-5 py-1.5 text-lg font-bold bg-surface border border-crimson-400/30 rounded-full shadow-md text-crimson-400 animate-pulse tracking-wide">
            Lupi 🐾
          </span>
        </div>
      </div>
    </div>
  );
};

export default Mascot;