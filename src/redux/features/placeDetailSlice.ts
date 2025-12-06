import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

interface City {
  _id: string;
  cityName: string;
  stateId: string;
  countryId: string;
  bestTimeToVisit: string;
  popularFor: string[];
  cityCoverImg: string;
}

interface PackageData {
  id:string;
  _id: string;
  packageName: string;
  packageType: string;
  cityIds: City[];
  durationDays: number;
  durationNights: number;
  basePricePerPerson: number;
  currency: string;
  inclusions: string[];
  exclusions: string[];
  coverImage: string;
  status: string;
  isDisabled: boolean;
  metaDescription:string;
  highlights:[];
  itinerary:[];
  ratings:{
    averageRating:number;
    totalReviews:number
  }
  galleryImages:string[];
  videoLink:string;
  category:string;
  transportType:string;
  childPrice:number;
  customAddOns:[];
}

interface PackageState {
  data: PackageData | null;
  loading: boolean;
  error: string | null;
}

const initialState: PackageState = {
  data: null,
  loading: false,
  error: null,
};

const BASE_URL= import.meta.env.VITE_BASE_URL
export const fetchPackageById = createAsyncThunk(
  "package/fetchById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get(
        `${BASE_URL}/packages/${id}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      }
      );
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.message || "Failed to fetch package details"
      );
    }
  }
);

const packageSlice = createSlice({
  name: "package",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPackageById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPackageById.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchPackageById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default packageSlice.reducer;
