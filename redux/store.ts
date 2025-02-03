import { configureStore } from "@reduxjs/toolkit";
import ploygonReducer from "./slices/ploygonSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      polygon: ploygonReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
