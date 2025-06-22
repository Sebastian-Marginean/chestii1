"use client";
import { useRef } from "react";
import { combineReducers, configureStore } from "@reduxjs/toolkit";
import {
  TypedUseSelectorHook,
  useDispatch,
  useSelector,
  Provider,
} from "react-redux";
import globalReducer from "@/state";
import { api } from "@/state/api";
import { setupListeners } from "@reduxjs/toolkit/query";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import createWebStorage from "redux-persist/lib/storage/createWebStorage";

/* Configuram stocarea pentru Redux. 
  Daca nu avem acces la window (server-side), folosim o solutie de fallback care nu va salva nimic */
const createFallbackStorage = () => ({
  getItem: async () => null,
  setItem: async (_key: any, value: any) => value,
  removeItem: async () => {},
});

const storage =
  typeof window !== "undefined"
    ? createWebStorage("local")
    : createFallbackStorage();

/* Setam ce reduceri vrem sa salvam in store */
const persistConfig = {
  key: "root",
  storage,
  whitelist: ["global"], // Salveaza doar reducer-ul global
};

/* Acum combinam reducerii. 
Folosim reducerul global si api-ul pentru a gestiona starea aplicatiei*/
const rootReducer = combineReducers({
  global: globalReducer,
  [api.reducerPath]: api.reducer,
});

/* Aplicam persistenta reducerilor */
const persistedReducer = persistReducer(persistConfig, rootReducer);

/* Crearea store-ului Redux. Adaugam middleware pentru a preveni erorile de 
serializare si adaugam api-ul pentru a lucra cu request-uri*/
export const initializeStore = () => {
  return configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
        },
      }).concat(api.middleware),
  });
};

/* Tipuri pentru Redux(ce tipuri vor fi folosite in store si actiuni) */
export type AppStore = ReturnType<typeof initializeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

/* Provider-ul pentru a conecta store-ul la aplicatie, facem persistenta store-ului si asiguram ca toate componentele vor putea sa foloseasca acea stare */
export default function StoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const storeRef = useRef<AppStore | null>(null);

  // Daca store-ul nu a fost creat deja, il cream aici si setam listener-ul
  if (!storeRef.current) {
    storeRef.current = initializeStore();
    setupListeners(storeRef.current.dispatch);
  }

  // Persistenta store-ului pentru a salva starea
  const persistor = persistStore(storeRef.current);

  return (
    <Provider store={storeRef.current}>
      <PersistGate loading={null} persistor={persistor}>
        {children}
      </PersistGate>
    </Provider>
  );
}
