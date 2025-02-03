import { createSlice } from "@reduxjs/toolkit";

interface PloygonState {
  hello: string;
}

const initialState: PloygonState = {
  hello: "world",
};

const polygonSlice = createSlice({
  name: "polygon",
  initialState,
  reducers: {
    addPloygon: (state, action) => {
      state.hello = action.payload;
    },
  },
});

export const { addPloygon } = polygonSlice.actions;

export default polygonSlice.reducer;
