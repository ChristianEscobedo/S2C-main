//this redux store is perfectly typed with preloaded state support
//preloadedstate allows to pass state to the store on server side
import {
  configureStore,
  combineReducers,
  ReducersMapObject,
  Middleware,
} from "@reduxjs/toolkit";
import { apis } from "./api";
import { slices } from "./slice";
import { TypedUseSelectorHook, useSelector, useDispatch } from "react-redux";

//this is the root reducer that combines all the slices and apis
const rootReducer = combineReducers({
  ...slices,
  ...apis.reduce((acc, api) => {
    acc[api.reducerPath] = api.reducer;
    return acc;
  }, {} as ReducersMapObject),
});

export type RootState = ReturnType<typeof rootReducer>;

//this is the store that combines all the slices and apis
//it also has preloaded state support
//it also has devtools enabled in development mode
//it also has middleware that combines all the apis
export function makeStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    middleware: (gDM) =>
      gDM().concat(...apis.map((a) => a.middleware as Middleware)),
    preloadedState,
    devTools: process.env.NODE_ENV !== "production",
  });
}

//this exports the store and the types for the store
export const store = makeStore();
export type AppStore = ReturnType<typeof makeStore>;
export type AppDispatch = AppStore["dispatch"];
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export const useAppDispatch = () => useDispatch<AppDispatch>();
