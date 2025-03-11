import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type Cookie = {
  emailAddress: string;
  userLevel: string;
  userid: string;
};

interface CookieState {
  cookie: Cookie | null; // Store a single cookie object or null
}

const initialState: CookieState = {
  cookie: null, // Initial state with no cookie
};

const cookieSlice = createSlice({
  name: "cookie",
  initialState,
  reducers: {
    setCookie: (state, action: PayloadAction<Cookie>) => {
      state.cookie = action.payload;
    },
    clearCookie: (state) => {
      state.cookie = null;
    },
  },
});

export const { setCookie, clearCookie } = cookieSlice.actions;

export default cookieSlice.reducer;
