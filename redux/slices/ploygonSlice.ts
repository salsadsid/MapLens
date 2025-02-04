import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { area, centroid } from "@turf/turf";

interface Polygon {
  id: string;
  coordinates: number[][];
  fillColor: string;
  borderColor: string;
  label: string;
  center: [number, number];
  area: number;
}

interface PolygonState {
  polygons: Polygon[];
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
      const polyFeature = {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [action.payload.coordinates],
        },
      };
      const polyCenter = centroid(polyFeature).geometry.coordinates as [
        number,
        number
      ];
      const polyArea = area(polyFeature);
      state.polygons.push({
        ...action.payload,
        fillColor: "#ff0000",
        borderColor: "#000000",
        label: `Polygon ${state.polygons.length + 1}`,
        center: polyCenter,
        area: polyArea,
      });
    },
    updatePolygon: (
      state,
      action: PayloadAction<{
        id: string;
        fillColor?: string;
        borderColor?: string;
        label?: string;
      }>
    ) => {
      const polygon = state.polygons.find((p) => p.id === action.payload.id);
      if (polygon) {
        if (action.payload.fillColor)
          polygon.fillColor = action.payload.fillColor;
        if (action.payload.borderColor)
          polygon.borderColor = action.payload.borderColor;
        if (action.payload.label) polygon.label = action.payload.label;
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
