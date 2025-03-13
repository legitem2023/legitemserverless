import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface CategoryState {
  id:string[];
  name:string[];
  categories: string[];
  types: string[];
  brands: string[];
  departments: string[];
  status:string[];
}

const initialState: CategoryState = {
  id:[],
  name:[],
  categories: [],
  types: [],
  brands: [],
  departments: [],
  status:[]
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
    setStatus:(state, action: PayloadAction<string[]>) => {
      state.status = action.payload;
    },
    setName:(state, action: PayloadAction<string[]>) => {
      state.name = action.payload;
    },
    setID:(state, action: PayloadAction<string[]>) => {
      state.id = action.payload;
    }
  },
});

export const { setCategories, setTypes, setBrands, setDepartments,setStatus,setName,setID } = categorySlice.actions;
export default categorySlice.reducer;
