import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PolygonState {
  polygons: {
    id: string;
    coordinates: number[][];
  }[];
}

const initialState: PolygonState = {
  polygons: [],
};

const polygonSlice = createSlice({
  name: "polygon",
  initialState,
  reducers: {
    addPolygon: (
      state,
      action: PayloadAction<{ id: string; coordinates: number[][] }>
    ) => {
      state.polygons.push({
        ...action.payload,
      });
    },
  },
});

export const { addPolygon } = polygonSlice.actions;

export default polygonSlice.reducer;
