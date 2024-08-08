"use client"
import { createContext, ReactNode, useState, useContext } from 'react';

interface ShoppingCartProviderProps {
  children: ReactNode;
}

interface ContextProps {
  cartItems: any[];
  handleAddToCart: (getCurrentItem: any) => void;
}

export const ShoppingCartContext = createContext<ContextProps | undefined>(undefined);

export function useCartGlobalState() {
  const context = useContext(ShoppingCartContext);
  if (!context) {
    throw new Error('useGlobalState must be used within a GlobalStateProvider');
  }
  return context;
}

export const getCartData = () => {
  const cartData = localStorage.getItem('cartItems');
  return cartData ? JSON.parse(cartData) : [];
};

export const setCartData = (cart:any) => {
  localStorage.setItem('cartItems', JSON.stringify(cart));
};
export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useState<any[]>([]);

  function handleAddToCart(getCurrentItem: any) {
    
    let cpyCartItems = getCartData();
    // const indexOfcurrentItem = cpyCartItems.findIndex(item =>item.id === getCurrentItem.id);
      cpyCartItems.push(getCurrentItem);
    setCartItems(cpyCartItems)
    setCartData(cpyCartItems);    
  }

  const contextValue: ContextProps = {
    cartItems,
    handleAddToCart,
  };

  return (
    <ShoppingCartContext.Provider value={contextValue}>
      {children}
    </ShoppingCartContext.Provider>)
}

