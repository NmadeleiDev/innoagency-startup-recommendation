import { createSlice } from '@reduxjs/toolkit';
const NUMBER_OF_ITEMS_TO_SHOW = 3;

interface IServiesState {
  offset: number;
}

const initialState: IServiesState = {
  offset: NUMBER_OF_ITEMS_TO_SHOW,
};

const servicesSlice = createSlice({
  name: 'services',
  initialState,
  reducers: {
    resetServicesState() {
      return initialState;
    },
    showNext(state) {
      state.offset += NUMBER_OF_ITEMS_TO_SHOW;
    },
  },
});

export const { resetServicesState, showNext } = servicesSlice.actions;
export default servicesSlice.reducer;
