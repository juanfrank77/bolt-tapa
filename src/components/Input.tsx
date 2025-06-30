import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'right';
  variant?: 'default' | 'filled';
}

const Input: React.FC<InputProps> = ({
  label,
  error,
  helperText,
  icon,
  iconPosition = 'left',
  variant = 'default',
  className = '',
  id,
  ...props
}) => {
  const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
  const errorId = error ? `${inputId}-error` : undefined;
  const helperTextId = helperText ? `${inputId}-helper` : undefined;

  const baseInputClasses = 'block w-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500';
  
  const variantClasses = {
    default: 'border border-gray-300 rounded-lg px-3 py-2 focus:border-transparent',
    filled: 'bg-gray-50 border border-transparent rounded-lg px-3 py-2 focus:bg-white focus:border-blue-500'
  };

  const errorClasses = error 
    ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
    : '';

  const iconClasses = icon 
    ? iconPosition === 'left' 
      ? 'pl-10' 
      : 'pr-10'
    : '';

  const inputClasses = `${baseInputClasses} ${variantClasses[variant]} ${errorClasses} ${iconClasses} ${className}`;

  return (
    <div className={`w-full ${error ? 'animate-shake' : ''}`}>
      {label && (
        <label 
          htmlFor={inputId}
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {label}
        </label>
      )}
      
      <div className="relative">
        {icon && (
          <div className={`absolute inset-y-0 ${iconPosition === 'left' ? 'left-0 pl-3' : 'right-0 pr-3'} flex items-center pointer-events-none`}>
            <span className="text-gray-400">
              {icon}
            </span>
          </div>
        )}
        
        <input
          id={inputId}
          className={`${inputClasses} transition-all duration-200 ease-in-out focus:scale-[1.02]`}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={[errorId, helperTextId].filter(Boolean).join(' ') || undefined}
          {...props}
        />
      </div>

      {error && (
        <p id={errorId} className="mt-1 text-sm text-red-600 animate-fade-in">
          {error}
        </p>
      )}

      {helperText && !error && (
        <p id={helperTextId} className="mt-1 text-sm text-gray-500 transition-colors duration-200">
          {helperText}
        </p>
      )}
    </div>
  );
};

export default Input;