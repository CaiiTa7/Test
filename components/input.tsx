
import React from 'react';

export interface InputProps {
  children: React.ReactNode;
}

export const Input = ({ children }: InputProps) => {
  return (
    <div className="input">
      {children}
    </div>
  );
};
