import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { api, IApiResponse } from 'axiosConfig';
import { CompanyModel, msp, progectStage } from 'models/Startup';
import { AppDispatch } from 'store/store';

interface IUserState {
  user: CompanyModel;
  companies: string[];
}

const initialState: IUserState = {
  user: {
    type: 'Company',
    id: '',
    inn: '',
    name: '',
    got_support_from: '',
    did_get_support: '',
    service: '',
    foundation_date: '',
    tech_focus: [],
    stage_of_development: progectStage[0].id,
    market: [],
    technology: [],
    business_model: [],
    main_okved: '',
    okved_secondary: [],
    msp_category: msp[0].id,
    is_export: 'да',
    inno_cluster_member: 'да',
    skolcovo_member: 'да',
    is_inno_company: 'да',
    is_startup: 'да',
    current_profit: 0,
    current_profit_tax: 0,
    current_revenue: 0,
  },
  companies: [],
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
    saveCompanies(state, { payload }: PayloadAction<string[]>) {
      state.companies = payload;
    },
  },
});

export const getCompanies = () => async (dispatch: AppDispatch) => {
  try {
    const { data } = await api.get<IApiResponse<string[]>>(`/company`);
    console.log(data);
    if (data.data) {
      dispatch(saveCompanies(data.data));
    }
  } catch (e) {
    console.log(e);
  }
};

export const getCompanyById = (id: string) => async (dispatch: AppDispatch) => {
  try {
    const { data } = await api.get<IApiResponse<CompanyModel>>(`/company/${id}`);
    console.log(data);
    if (data.data) {
      dispatch(saveUserState(data.data));
    }
  } catch (e) {
    console.log(e);
  }
};

export const getRandomCompany = () => async (dispatch: AppDispatch) => {
  try {
    const { data } = await api.get<IApiResponse<{ entities: string[] }>>(
      `/company`
    );
    console.log(data);
    if (data.data?.entities) {
      const id =
        data.data.entities[
          Math.floor(Math.random() * data.data.entities.length)
        ];
      const res = await api.get<IApiResponse<CompanyModel>>(`/company/${id}`);
      if (res.data.data) dispatch(saveUserState(res.data.data));
    }
  } catch (e) {
    console.log(e);
  }
};

export const { resetUserState, saveUserState, saveCompanies } =
  userSlice.actions;
export default userSlice.reducer;
