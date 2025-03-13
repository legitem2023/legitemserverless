'use client'
import { configureStore } from '@reduxjs/toolkit';
import activeIndexReducer from './activeIndexSlice';
import cookieReducer from './cookieSlice';
import styleCodeReducer from './styleCodeSlice';
import categoryReducer from './categorySlice';
const store = configureStore({
  reducer: {
    cookie:cookieReducer,
    styleCode:styleCodeReducer,
    activeIndex:activeIndexReducer,
    category:categoryReducer
  },
});

export default store;
