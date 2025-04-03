import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Define the type for detailID, assuming it's a string or number
type DetailID = string | number;

interface DetailIDState {
  detailID: DetailID | null; // Store a single detail ID or null
}

const initialState: DetailIDState = {
  detailID: null, // Initial state with no detail ID
};

const detailIDSlice = createSlice({
  name: "detailID",
  initialState,
  reducers: {
    setDetailID: (state, action: PayloadAction<DetailID>) => {
      state.detailID = action.payload;
    },
    clearDetailID: (state) => {
      state.detailID = null;
    },
  },
});

export const { setDetailID, clearDetailID } = detailIDSlice.actions;

export default detailIDSlice.reducer;
