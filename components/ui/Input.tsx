import React from 'react';

interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'className'> {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  label?: string;
  error?: string;
  className?: string;
}

export default function Input({
  type = 'text',
  value,
  onChange,
  placeholder,
  label,
  error,
  required = false,
  className = '',
  ...rest
}: InputProps) {
  return (
    <div className="w-full">
      {label && (
        <label className="block mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className={`w-full px-4 py-3 rounded-lg border transition-colors
          ${
            error
              ? 'border-red-500 focus:border-red-600 focus:ring-2 focus:ring-red-200'
              : 'border-zinc-300 dark:border-zinc-700 focus:border-zinc-950 dark:focus:border-zinc-50 focus:ring-2 focus:ring-zinc-200 dark:focus:ring-zinc-800'
          }
          bg-white dark:bg-zinc-900
          text-zinc-900 dark:text-zinc-100
          placeholder:text-zinc-400 dark:placeholder:text-zinc-600
          outline-none
          ${className}
        `}
        {...rest}
      />
      {error && (
        <p className="mt-1 text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}
