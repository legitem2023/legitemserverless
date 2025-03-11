'use client'
import { configureStore } from '@reduxjs/toolkit';

import cookieReducer from './cookieSlice'
 
const store = configureStore({
  reducer: {
    cookie:cookieReducer,
  },
});

export default store;
