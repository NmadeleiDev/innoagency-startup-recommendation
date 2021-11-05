import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AcceleratorModel, VentureFondModel } from 'models/Startup';

interface IServiesState {
  displayedItem: VentureFondModel | AcceleratorModel | null;
  accelerators: AcceleratorModel[];
  fonds: VentureFondModel[];
  recomendations: {
    accelerators: string[];
    fonds: string[];
  };
}

const initialState: IServiesState = {
  displayedItem: null,
  accelerators: [],
  fonds: [],
  recomendations: {
    accelerators: [],
    fonds: [],
  },
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    resetServicesState() {
      return initialState;
    },
    setDispayedService(
      state,
      { payload }: PayloadAction<AcceleratorModel | VentureFondModel | null>
    ) {
      state.displayedItem = payload;
    },
  },
});

export const { resetServicesState, setDispayedService } = servicesSlice.actions;
export default servicesSlice.reducer;
