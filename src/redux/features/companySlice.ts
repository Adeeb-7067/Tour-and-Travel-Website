// src/redux/slices/companySlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export interface CompanyData {
  name: string;
  aboutUs: string;
  address: string;
  contactNumber: string;
  createdAt: string;
  favIcon: string;
  helpAndSupport: string;
  loader: string;
  logo: string;
  privacyPolicy: string;
  supportEmail: string;
  termsAndCondition: string;
}

interface CompanyState {
  data: CompanyData | null;
  loading: boolean;
  error: string | null;
}

const initialState: CompanyState = {
  data: null,
  loading: false,
  error: null,
};

export const fetchCompany = createAsyncThunk(
  "company/fetchCompany",
  async (_, { rejectWithValue }) => {
    try {
      const BASE_URL = import.meta.env.VITE_BASE_URL;
      const token = localStorage.getItem("token");
      const response = await axios.get(`${BASE_URL}/company`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Failed to fetch company");
    }
  }
);

const companySlice = createSlice({
  name: "company",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCompany.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCompany.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchCompany.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default companySlice.reducer;
