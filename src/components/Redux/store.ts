'use client'
import { configureStore } from '@reduxjs/toolkit';
import activeIndexReducer from './activeIndexSlice';
import cookieReducer from './cookieSlice';
import styleCodeReducer from './styleCodeSlice';
import categoryReducer from './categorySlice';
import swipeReducer from './swipeSlice'
import productDetailsReducer from './productDetailsSlice';
const store = configureStore({
  reducer: {
    cookie:cookieReducer,
    styleCode:styleCodeReducer,
    activeIndex:activeIndexReducer,
    category:categoryReducer,
    swipe:swipeReducer,
    productDetails:productDetailsReducer
  },
});

export default store;
