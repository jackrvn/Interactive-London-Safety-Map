import React from 'react';

type BackdropProps = {
  isVisible: boolean;
  onClick: () => void;
};

export const Backdrop: React.FC<BackdropProps> = ({ isVisible, onClick }) => {
  if (!isVisible) return null;
  
  return (
    <div 
      className="control-panel-backdrop"
      onClick={onClick}
    />
  );
};