import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ProductDetailsState {
  id: string[];
  color: string[];
  size: string[];
  price: number[];
  stock: number[];
  description: string[];
  status: string[];
}

const initialState: ProductDetailsState = {
  id: [],
  color: [],
  size: [],
  price: [],
  stock: [],
  description: [],
  status: [],
};

const productDetailsSlice = createSlice({
  name: "productDetails",
  initialState,
  reducers: {
    setID: (state, action: PayloadAction<string[]>) => {
      state.id = action.payload;
    },
    setColor: (state, action: PayloadAction<string[]>) => {
      state.color = action.payload;
    },
    setSize: (state, action: PayloadAction<string[]>) => {
      state.size = action.payload;
    },
    setPrice: (state, action: PayloadAction<number[]>) => {
      state.price = action.payload;
    },
    setStock: (state, action: PayloadAction<number[]>) => {
      state.stock = action.payload;
    },
    setDescription: (state, action: PayloadAction<string[]>) => {
      state.description = action.payload;
    },
    setStatus: (state, action: PayloadAction<string[]>) => {
      state.status = action.payload;
    },
  },
});

export const { setID, setColor, setSize, setPrice, setStock, setDescription, setStatus } = productDetailsSlice.actions;
export default productDetailsSlice.reducer;