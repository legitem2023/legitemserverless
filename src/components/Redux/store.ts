'use client'
import { configureStore } from '@reduxjs/toolkit';
import activeIndexReducer from './activeIndexSlice';
import cookieReducer from './cookieSlice';
import styleCodeReducer from './styleCodeSlice';
const store = configureStore({
  reducer: {
    cookie:cookieReducer,
    styleCode:styleCodeReducer,
    activeIndex:activeIndexReducer
  },
});

export default store;
