import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface PolygonState {
  polygons: {
    id: string;
    coordinates: number[][];
    fillColor: string;
    borderColor: string;
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
        fillColor: "#ff0000",
        borderColor: "#000000",
      });
    },
    updatePolygon: (
      state,
      action: PayloadAction<{
        id: string;
        fillColor?: string;
        borderColor?: string;
      }>
    ) => {
      const polygon = state.polygons.find((p) => p.id === action.payload.id);
      if (polygon) {
        if (action.payload.fillColor)
          polygon.fillColor = action.payload.fillColor;
        if (action.payload.borderColor)
          polygon.borderColor = action.payload.borderColor;
      }
    },
    deletePolygon: (state, action: PayloadAction<string>) => {
      state.polygons = state.polygons.filter((p) => p.id !== action.payload);
    },
  },
});

export const { addPolygon, updatePolygon, deletePolygon } =
  polygonSlice.actions;

export default polygonSlice.reducer;
