'use client'
import { configureStore } from '@reduxjs/toolkit';
import activeIndexReducer from './activeIndexSlice';
import cookieReducer from './cookieSlice';
import styleCodeReducer from './styleCodeSlice';
import categoryReducer from './categorySlice';
import swipeReducer from './swipeSlice'
const store = configureStore({
  reducer: {
    cookie:cookieReducer,
    styleCode:styleCodeReducer,
    activeIndex:activeIndexReducer,
    category:categoryReducer,
    swipe:swipeReducer
  },
});

export default store;
