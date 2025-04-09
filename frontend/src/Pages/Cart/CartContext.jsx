
import React, { createContext, useContext } from 'react';
const CartContext = createContext();

export const CartProvider = ({ children }) => {

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    setUser(null);
  };

  return (
    <CartContext.Provider value={{ logout }}>
      {children}
    </CartContext.Provider>
  );
};


export const useCart = () => useContext(CartContext);
