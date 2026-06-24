import React from 'react';

const Button = ({ children, variant = 'primary', size = 'md', className = '', isLoading = false, ...props }) => {
  const base = 'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-crimson-gradient text-white hover:shadow-glow focus:ring-crimson-400/50',
    secondary: 'bg-surface-hover text-text-primary border border-border hover:border-crimson-400/30 focus:ring-crimson-400/50',
    outline: 'border-2 border-crimson-400 text-crimson-400 hover:bg-crimson-400/10 focus:ring-crimson-400/50',
    danger: 'bg-red-600 text-white hover:bg-red-700 focus:ring-red-500',
    ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-hover focus:ring-crimson-400/50',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-7 py-3.5 text-base',
  };
  return (
    <button className={`${base} ${variants[variant]} ${sizes[size]} ${className}`} disabled={isLoading || props.disabled} {...props}>
      {isLoading && <span className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></span>}
      {children}
    </button>
  );
};

export default Button;