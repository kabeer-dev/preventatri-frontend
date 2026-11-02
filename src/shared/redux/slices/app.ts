import {createSlice, PayloadAction, ThunkAction} from '@reduxjs/toolkit';

import {RootState} from '@/shared/redux/store';
import {AppState} from '@/shared/types/redux';

// ----------------------------------------------------------------------
const defaultState: AppState = {
  language: 'english',
};

const slice = createSlice({
  name: 'Project-Name',
  initialState: defaultState,
  reducers: {
    setAppLanguage(state, action: PayloadAction<string>) {
      state.language = action.payload;
    },
  },
});

// Reducer
export default slice.reducer;

export const actions = slice.actions;

export const setAppLanguageThunk =
  ({
    language,
  }: {
    language: string;
  }): ThunkAction<void, RootState, unknown, PayloadAction<string>> =>
  (dispatch) =>
    dispatch(actions.setAppLanguage(language));

export const getAppLanguage = (state: {app: AppState}) => state.app.language;
