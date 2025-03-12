import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type StyleCode = {
  code: string;
  description: string;
};

interface StyleCodeState {
  styleCode: StyleCode | null; // Store a single style code object or null
}

const initialState: StyleCodeState = {
  styleCode: null, // Initial state with no style code
};

const styleCodeSlice = createSlice({
  name: "styleCode",
  initialState,
  reducers: {
    setStyleCode: (state, action: PayloadAction<StyleCode>) => {
      state.styleCode = action.payload;
    },
    clearStyleCode: (state) => {
      state.styleCode = null;
    },
  },
});

export const { setStyleCode, clearStyleCode } = styleCodeSlice.actions;

export default styleCodeSlice.reducer;
