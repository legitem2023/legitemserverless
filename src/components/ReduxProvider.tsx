'use client'
import { Provider } from 'react-redux';
import store from "./store";
import React from 'react'
import { Apollo } from './Apollo';

export default function ReduxWrapper({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <Provider store={store}>
        <Apollo>{children}</Apollo>
      </Provider>
    );
  }
