import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface ActiveIndexState {
  activeIndex: number;
}

const initialState: ActiveIndexState = {
  activeIndex: 0,
};

const activeIndexSlice = createSlice({
  name: "activeIndex",
  initialState,
  reducers: {
    setActiveIndex: (state, action: PayloadAction<number>) => {
      state.activeIndex = action.payload;
    },
  },
});

export const { setActiveIndex } = activeIndexSlice.actions;
export default activeIndexSlice.reducer;
