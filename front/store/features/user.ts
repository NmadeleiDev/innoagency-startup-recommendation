import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { CompanyModel } from 'models/Startup';

interface IUserState {
  user: CompanyModel | null;
}

const initialState: IUserState = {
  user: null,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    resetUserState() {
      return initialState;
    },
    saveUserState(state, { payload }: PayloadAction<CompanyModel>) {
      state.user = payload;
    },
  },
});

/**
 * 
  id: number;
  inn: string;
  companyName: string;
  foundationDate: number;
  companyDescription: string;
  logo?: string;
  tags?: {
    markets?: number[];
    technologies?: number[];
    businessModel?: number[];
  };
  details: {
    teamSize: number;
    projectStage: number;
    companyCity: string;
    companyProducts?: string[];
    investmentRound?: number;
  };
  contacts: {
    email: string;
    phone?: string;
    site: string;
  };
  owner?: {
    firstName: string;
    lastName: string;
    middleName?: string;
    age: number;
    marriage?: boolean;
  };
 */

export const { resetUserState, saveUserState } = userSlice.actions;
export default userSlice.reducer;
