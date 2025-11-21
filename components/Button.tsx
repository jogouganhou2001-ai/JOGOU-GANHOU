import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline';
  fullWidth?: boolean;
  children: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({ 
  variant = 'primary', 
  fullWidth = false, 
  className = '', 
  children, 
  ...props 
}) => {
  const baseStyles = "px-6 py-3 rounded-xl font-bold transition-all duration-200 active:scale-95 flex items-center justify-center gap-2 shadow-sm";
  
  const variants = {
    primary: "bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-200",
    secondary: "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-200",
    outline: "border-2 border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
  };

  const widthClass = fullWidth ? "w-full" : "";

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${widthClass} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};