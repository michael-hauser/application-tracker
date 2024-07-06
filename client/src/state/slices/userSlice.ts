import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { fetchUserProfileAPI, loginUserAPI, looutUserAPI as logutUserAPI, registerUserAPI } from '../../services/userService';
import { saveAuthToken, removeAuthToken } from '../../utils/auth';
import { IAuthModel, IUser } from '../../models/User.model';

interface UserState {
  user: IUser | null;
  status: 'idle' | 'loading' | 'failed';
  error: string | null;
}

const initialState: UserState = {
  user: null,
  status: 'idle',
  error: null
};

export const loginUser = createAsyncThunk(
  'user/loginUser',
  async (credentials: { email: string; password: string }) => {
    const response = await loginUserAPI(credentials);
    return response.data;
  }
);

export const registerUser = createAsyncThunk(
  'user/registerUser',
  async (user: { name: string; email: string; password: string; }) => {
    const response = await registerUserAPI(user);
    return response.data;
  }
);

export const logoutUser = createAsyncThunk(
  'user/logoutUser',
  async () => {
    const response = await logutUserAPI();
    return response.data;
  }
);

export const fetchUserDetails = createAsyncThunk(
  'user/fetchUserDetails',
  async () => {
    try {
      const response = await fetchUserProfileAPI();
      return response.data; 
    } catch (error) {
      throw new Error('Failed to fetch user details');
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<IAuthModel>) => {
        if(!action.payload.user || !action.payload.token) return;
        state.status = 'idle';
        state.user = action.payload.user;
        saveAuthToken(action.payload.token);
      })
      .addCase(loginUser.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(registerUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<IAuthModel>) => {
        if(!action.payload.user || !action.payload.token) return;
        state.status = 'idle';
        state.user = action.payload.user;
        saveAuthToken(action.payload.token);
      })
      .addCase(registerUser.rejected, (state) => {
        state.status = 'failed';
      })
      .addCase(logoutUser.pending, (state, action: any) => {
        state.status = 'loading';
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.status = 'idle';
        state.user = null;
        removeAuthToken();
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch user details';
      })
      .addCase(fetchUserDetails.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserDetails.fulfilled, (state, action: PayloadAction<IUser>) => {
        state.status = 'idle';
        state.user = action.payload;
        state.error = null;
      })
      .addCase(fetchUserDetails.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message ?? 'Failed to fetch user details';
      });
  },
});

export const selectUser = (state: RootState) => state.user.user;
export const selectUserStatus = (state: RootState) => state.user.status;

export default userSlice.reducer;
