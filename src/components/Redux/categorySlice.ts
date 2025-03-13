import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  categories: string[];
  types: string[];
  brands: string[];
  departments: string[];
}

const initialState: CategoryState = {
  categories: [],
  types: [],
  brands: [],
  departments: [],
};

const categorySlice = createSlice({
  name: "category",
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<string[]>) => {
      state.categories = action.payload;
    },
    setTypes: (state, action: PayloadAction<string[]>) => {
      state.types = action.payload;
    },
    setBrands: (state, action: PayloadAction<string[]>) => {
      state.brands = action.payload;
    },
    setDepartments: (state, action: PayloadAction<string[]>) => {
      state.departments = action.payload;
    },
  },
});

export const { setCategories, setTypes, setBrands, setDepartments } = categorySlice.actions;
export default categorySlice.reducer;
