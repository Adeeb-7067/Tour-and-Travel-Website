// store/slices/reviewSlice.ts
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

interface User {
  _id: string;
  firstName: string;
  lastName?: string;
  fullName: string;
  avatarUrl?: string;
}

interface PackageItem {
  _id: string;
  placeName: string;
  averageRating: number;
  totalReviews: number;
}

interface ReviewItem {
  _id: string;
  userId: User;
  packageId: PackageItem;
  rating: number;
  review: string;
  location?: number;
  price?: number;
  services?: number;
  createdAt: string;
  updatedAt: string;
}

interface Pagination {
  totalItems: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface ReviewState {
  reviews: ReviewItem[];
  pagination: Pagination | null;
  loading: boolean;
  error: string | null;
}

const initialState: ReviewState = {
  reviews: [], // Initialize as empty array, not null
  pagination: null,
  loading: false,
  error: null,
};


// Memoize base URL to avoid repeated imports
const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchReviews = createAsyncThunk(
  'reviews/fetchReviews',
  async ({
    page = 1,
    limit = 2,
    packageId,
  }: {
    page?: number;
    limit?: number;
    packageId?: string;
  }, { rejectWithValue, signal }) => { // Add AbortController signal
    try {
      const res = await axios.get(`${BASE_URL}/review`, {
        params: { page, limit, packageId },
        signal, // Add cancellation support
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      return {
        data: res.data.data || [],
        pagination: res.data.data?.pagination || null
      };
    } catch (error: any) {
      if (axios.isCancel(error)) {
        return rejectWithValue('Request cancelled');
      }
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }
);

const reviewSlice = createSlice({
  name: 'reviews',
  initialState,
  reducers: {
    clearReviews: (state) => {
      state.reviews = [];
      state.pagination = null;
      state.error = null;
    },
    // Add new reducer to avoid full state reset
    addReview: (state, action: PayloadAction<ReviewItem>) => {
      state.reviews.unshift(action.payload);
      if (state.pagination) {
        state.pagination.totalItems += 1;
        state.pagination.totalPages = Math.ceil(state.pagination.totalItems / state.pagination.pageSize);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchReviews.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReviews.fulfilled, (state, action) => {
        state.loading = false;
        state.reviews = action.payload.data || [];
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchReviews.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.reviews = [];
      });
  },
});

export const { clearReviews, addReview } = reviewSlice.actions;
export default reviewSlice.reducer;