import React, { createContext, useContext, useState } from 'react';
const TitleContext = createContext(undefined);
export const TitleProvider = ({
  children
}) => {
  const [title, setTitle] = useState('BEM VINDO!');
  return <TitleContext.Provider value={{
    title,
    setTitle
  }}>{children}</TitleContext.Provider>;
};
export const useTitle = () => {
  const context = useContext(TitleContext);
  if (context === undefined) {
    throw new Error('useTitle must be used within a TitleProvider');
  }
  return context;
};