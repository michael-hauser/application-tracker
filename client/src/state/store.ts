import { configureStore, ThunkAction, Action } from '@reduxjs/toolkit';
import applicationReducer from './slices/applicationSlice';
import userReducer from './slices/userSlice';
import stageReducer from './slices/stageSlice';

export const store = configureStore({
  reducer: {
    application: applicationReducer,  
    user: userReducer,
    stage: stageReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
