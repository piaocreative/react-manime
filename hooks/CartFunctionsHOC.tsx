import React from 'react';
import useCartFunctions from './useCartFunctions';

export const withCartFunctionsHOC = (Component: any) => {
  return (props: any) => {
    const cartFunctions = useCartFunctions();

    return <Component cartFunctions={cartFunctions} {...props} />;
  };
};
