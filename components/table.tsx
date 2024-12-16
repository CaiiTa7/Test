
import React from 'react';

export interface TableProps {
  children: React.ReactNode;
}

export const Table = ({ children }: TableProps) => {
  return (
    <div className="table">
      {children}
    </div>
  );
};
