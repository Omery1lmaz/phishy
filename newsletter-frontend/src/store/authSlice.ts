import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const adminLogin = createAsyncThunk(
  'auth/adminLogin',
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    const res = await axios.post(`${API_URL}/auth/admin/login`, { email, password });
    return { token: res.data.token, role: 'admin' };
  }
);

export const userLogin = createAsyncThunk(
  'auth/userLogin',
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    const res = await axios.post(`${API_URL}/auth/user/login`, { email, password });
    return { token: res.data.token, role: 'user' };
  }
);

export const adminRegister = createAsyncThunk(
  'auth/adminRegister',
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    await axios.post(`${API_URL}/auth/admin/register`, { email, password });
    return true;
  }
);

export const userRegister = createAsyncThunk(
  'auth/userRegister',
  async ({ email, password }: { email: string; password: string }, thunkAPI) => {
    await axios.post(`${API_URL}/auth/user/register`, { email, password });
    return true;
  }
);

const initialState = {
  token: localStorage.getItem('token'),
  role: localStorage.getItem('role'),
  loading: false,
  error: null as string | null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.token = null;
      state.role = null;
      localStorage.removeItem('token');
      localStorage.removeItem('role');
    },
    setAuth(state, action) {
      state.token = action.payload.token;
      state.role = action.payload.role;
      localStorage.setItem('token', action.payload.token);
      localStorage.setItem('role', action.payload.role);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(adminLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(adminLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', action.payload.role);
      })
      .addCase(adminLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Admin login failed';
      })
      .addCase(userLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(userLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.token = action.payload.token;
        state.role = action.payload.role;
        localStorage.setItem('token', action.payload.token);
        localStorage.setItem('role', action.payload.role);
      })
      .addCase(userLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'User login failed';
      });
  },
});

export const { logout, setAuth } = authSlice.actions;
export default authSlice.reducer; 