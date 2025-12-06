import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_BASE_URL;

interface ImageItem {
  url: string;
  alt: string;
  _id: string;
}

interface Feature {
  icon: string;
  title: string;
  description: string;
  order: number;
  _id: string;
}

interface AboutData {
  _id: string;
  pageName: string;
  isActive: boolean;
  seoMeta: {
    title: string;
    description: string;
    keywords: string[];
  };
  heroSection: {
    backgroundImage: string;
    title: string;
    _id: string;
  };
  mainContent: {
    badge: { text: string; subText: string };
    ctaButton: { text: string; link: string };
    images: ImageItem[];
    heading: string;
    description: string;
  };
  whatWeDo: {
    sectionTitle: string;
    heading: string;
    description: string;
    features: Feature[];
  };
  popularDestinations: {
    ctaButton: { text: string; link: string };
    backgroundImage: string;
    sectionTitle: string;
    heading: string;
  };
  footerInfo: {
    address: string;
    phone: string;
    openingHours: { day: string; hours: string }[];
    quickLinks: { label: string; link: string }[];
  };
}

interface AboutState {
  data: AboutData | null;
  loading: boolean;
  error: string | null;
}

// ✅ Async thunk for fetching About data
export const fetchAbout = createAsyncThunk<AboutData, void, { rejectValue: string }>(
  "about/fetchAboutData",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get(`${BASE_URL}/about`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      return response?.data?.data?.[0]; 
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch about data"
      );
    }
  }
);

const initialState: AboutState = {
  data: null,
  loading: false,
  error: null,
};

const aboutSlice = createSlice({
  name: "about",
  initialState,
  reducers: {
    clearAbout: (state) => {
      state.data = null;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAbout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAbout.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchAbout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Failed to fetch about data";
      });
  },
});

export const { clearAbout } = aboutSlice.actions;
export default aboutSlice.reducer;
