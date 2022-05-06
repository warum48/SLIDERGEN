import { createSlice } from "@reduxjs/toolkit";

export const TagSlice = createSlice({
  name: "tag",
  initialState: {
    value: ""
  },
  reducers: {
    updatetag: (state, action) => {
      state.value = action.payload;
    }
  }
});
// each case under reducers becomes an action
export const { updatetag } = TagSlice.actions;
export default TagSlice.reducer;
