import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface SwipeState {
  activeIndex: number;
}

const initialState: SwipeState = {
  activeIndex: 0,
};

const swipeSlice = createSlice({
  name: "swipe",
  initialState,
  reducers: {
    setActiveIndex: (state, action: PayloadAction<number>) => {
      state.activeIndex = action.payload;
    },
  },
});

export const { setActiveIndex } = swipeSlice.actions;
export default swipeSlice.reducer;
