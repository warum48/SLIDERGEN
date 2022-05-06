import { createSlice } from "@reduxjs/toolkit";

export const langSlice = createSlice({
  name: "lang",
  initialState: {
    value: "ru"
  },
  reducers: {
    setEn: (state) => {
      state.value = "en";
    },
    setRu: (state) => {
      state.value = "ru";
    }
  }
});
// each case under reducers becomes an action
export const { setEn, setRu } = langSlice.actions;
export default langSlice.reducer;
