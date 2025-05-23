import React from 'react';

//misc utility functions
export function WipeLocalStorage(){
  localStorage.clear();
}

export const createDynamicComponent = (component: React.ComponentType<any>, props: any) => {
  return React.createElement(component, props);
};

export function getRandomInt(min: number, max: number): number {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
