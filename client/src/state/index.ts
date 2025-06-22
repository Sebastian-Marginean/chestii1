import { createSlice, PayloadAction } from "@reduxjs/toolkit";

// Definirea tipului initial al starii
export interface GlobalState {
  sidebarRestrans: boolean;
}

// Starea initiala
const initialState: GlobalState = {
  sidebarRestrans: false,
};

// Crearea reducer-ului global
export const globalSlice = createSlice({
  name: "global", // Numele slice-ului
  initialState, // Starea initială
  reducers: {
    // Reducer pentru a schimba starea sidebar-ului
    setSidebarRestrans: (state, action: PayloadAction<boolean>) => {
      state.sidebarRestrans = action.payload;
    },
  },
});

// Exportarea actiunilor pentru a fi folosite in componente
export const { setSidebarRestrans } = globalSlice.actions;

// Exportarea reducer-ului pentru a fi folosit in store
export default globalSlice.reducer;
