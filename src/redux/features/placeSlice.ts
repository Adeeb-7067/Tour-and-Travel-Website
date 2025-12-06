// redux/features/placesSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import axios from "axios";

// Types
export interface Place {
  id: string;
  title: string;
  thumb: string;
  location: string;
  price: string | number;
  duration: string;
  featured: string | null;
  offer: string | null;
  tag: string | null;
  total_review: number;
  page: string;
  isWishlist:boolean;
}

interface Pagination {
  totalItems: number;
  totalPages: number;
  pageSize: number;
  currentPage: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
}

interface FilterData {
  city: { _id: string; cityName: string }[];
  country: { _id: string; countryName: string }[];
  // Duration filter now uses a min/max object like priceFilter
  duration: { min: number; max: number };
  ratings: number[];
  priceFilter: { min: number; max: number }; // Changed from array to object
}

interface SelectedFilters {
  cities: string[];
  countries: string[];
  // durations will now be an array of two numbers [min, max]
  durations: number[];
  ratings: number[];
  prices: number[];
}

interface PlacesState {
  // FeatureArea state
  places: Place[];
  pagination: Pagination;
  loading: boolean;
  cardLoading: boolean;
  error: string | null;
  noResults: boolean;
  
  // FeatureSidebar state
  filterData: FilterData;
  selectedFilters: SelectedFilters;
  filterLoading: boolean;
  filterError: string | null;
  
  // FeatureTop state
  isListView: boolean;
  sortBy: string;
  isWishlist:boolean
}

const initialState: PlacesState = {
  places: [],
  pagination: {
    totalItems: 0,
    totalPages: 0,
    pageSize: 9,
    currentPage: 1,
    hasNextPage: false,
    hasPrevPage: false,
  },
  loading: false,
  cardLoading: false,
  error: null,
  noResults: false,
  
  filterData: {
    city: [],
    country: [],
    duration: { min: 0, max: 40 },
    ratings: [],
    priceFilter:{min:0,max:1000}
  },
  selectedFilters: {
    cities: [], 
    countries: [],
    durations: [],
    ratings: [],
    prices: [],
  },
  filterLoading: false,
  filterError: null,
  
  isListView: false,
  sortBy: "",
  isWishlist:false
};

const BASE_URL = import.meta.env.VITE_BASE_URL;

const buildQueryParams = (page: number = 1, filters: any = {}, pageSize: number = 10) => {
  const params: any = {
    page: page,
    limit: pageSize,
  };

  if (filters.cities && filters.cities.length > 0) params.cityId = filters.cities.join(",");
  if (filters.countries && filters.countries.length > 0) params.countryId = filters.countries.join(",");
  // If durations is provided as a range [min, max], send minDuration/maxDuration
  if (filters.durations && Array.isArray(filters.durations) && filters.durations.length === 2) {
    params.minDuration = filters.durations[0];
    params.maxDuration = filters.durations[1];
  }
  if (filters.ratings && filters.ratings.length > 0) params.rating = filters.ratings.join(",");
  // if (filters.prices && filters.prices.length > 0) params.price = filters.prices.join(",");
  if (filters.prices && filters.prices.length === 2 ) {
    params.min = filters.prices[0];
    params.max = filters.prices[1];
  }
  return params;
};

export const fetchPlaces = createAsyncThunk(
  "places/fetchPlaces",
  async (
    {
      page = 1,
      filters = {},
    }: { page?: number; filters?: any; isInitial?: boolean },
    { rejectWithValue }
  ) => {
    try {
const userId = localStorage.getItem('userId')
      // Build query params
      const params = {
        ...buildQueryParams(page, filters),
        ...(userId !== undefined && { userId }),
      };


      const res = await axios.get(`${BASE_URL}packages`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        params,
      });

      if (res.data.data && res.data.data.length > 0) {
        const mappedData = res.data.data.map((item: any) => ({
          id: item._id,
          title: item.packageName,
          thumb: item.coverImage,
          location: item.tagline || "Unknown",
          price: item.basePricePerPerson || "N/A",
          duration: item.durationDays || "N/A",
          featured: item.category ? "Featured" : null,
          offer: item.crowdLevel ? `${item.crowdLevel} Crowd` : null,
          tag: item.packageType || null,
          total_review: item.ratings.totalReviews,
          page: "shop_2",
          isWishlist: item.isWishlist,
        }));


        return {
          data: mappedData,
          pagination: res.data.pagination || {
            totalItems: 0,
            totalPages: 0,
            pageSize: 9,
            currentPage: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
      } else {
        return {
          data: [],
          pagination: {
            totalItems: 0,
            totalPages: 0,
            pageSize: 9,
            currentPage: 1,
            hasNextPage: false,
            hasPrevPage: false,
          },
        };
      }
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch data");
    }
  }
);

// Async thunk for fetching filter data
export const fetchFilterData = createAsyncThunk(
  "places/fetchFilterData",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/places/filter/data`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      if (res.data.success && res.data.data) {
        // Support backends that now provide a duration filter as a min/max object
        const durationFilter =
          res.data.data.durationFilter ||
          (res.data.data.durationDays && typeof res.data.data.durationDays.min === "number" && typeof res.data.data.durationDays.max === "number"
            ? res.data.data.durationDays
            : null);

        return {
          city: res.data.data.city || [],
          country: res.data.data.countries || [],
          duration: durationFilter || { min: 0, max:40 },
          ratings: res.data.data.rating || [],
          priceFilter: res.data.data.priceFilter || {min:0,max:1000}
        };
      }
      return initialState.filterData;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch filter data");
    }
  }
);

const placesSlice = createSlice({
  name: "places",
  initialState,
  reducers: {
    // Filter actions
updateSelectedFilters: (state, action: PayloadAction<{ filterType: string; value: string | number | number[]; isChecked: boolean ;    prices: [number, number] | null }>) => {
  const { filterType, value, isChecked } = action.payload;

  switch (filterType) {
    case "city":
      state.selectedFilters.cities = isChecked
        ? [...state.selectedFilters.cities, value as string]
        : state.selectedFilters.cities.filter((v) => v !== value);
      break;
    case "country":
      state.selectedFilters.countries = isChecked
        ? [...state.selectedFilters.countries, value as string]
        : state.selectedFilters.countries.filter((v) => v !== value);
      break;
    case "duration":
      // Expecting range array [min, max] similar to price. Replace the selected range.
      if (Array.isArray(value) && value.length === 2) {
        state.selectedFilters.durations = value as number[];
      }
      break;
    case "rating":
      state.selectedFilters.ratings = isChecked
        ? [...state.selectedFilters.ratings, value as number]
        : state.selectedFilters.ratings.filter((v) => v !== value);
      break;
    case "price":
      if (Array.isArray(value) ) {
        state.selectedFilters.prices = value; // [min, max]
      }
      break;
  }
},
updateWishlistLocally: (state, action) => {
  state.places = action.payload;
},
mergeWishlist: (state, action) => {
  const wishlistIds = action.payload.map((p: any) => p.id);
  state.places = state.places.map((p: any) =>
    wishlistIds.includes(p.id) ? { ...p, isWishlist: true } : p
  );
},


    clearAllFilters: (state) => {
      state.selectedFilters = {
        cities: [],
        countries: [],
        durations: [],
        ratings: [],
        prices: [],
      };
    },
 
    
    // View actions
    setListView: (state, action: PayloadAction<boolean>) => {
      state.isListView = action.payload;
    },
    
    // Sort actions
    setSortBy: (state, action: PayloadAction<string>) => {
      state.sortBy = action.payload;
    },
    
    // Reset state
    resetPlacesState: () => initialState,
  },
  extraReducers: (builder) => {
    builder
      // Fetch places
      .addCase(fetchPlaces.pending, (state, action) => {
        const { isInitial } = action.meta.arg;
        if (isInitial) {
          state.loading = true;
        } else {
          state.cardLoading = true;
        }
        state.error = null;
        state.noResults = false;
      })
      .addCase(fetchPlaces.fulfilled, (state, action) => {
        state.loading = false;
        state.cardLoading = false;
        state.places = action.payload.data;
        state.pagination = action.payload.pagination;
        state.noResults = action.payload.data.length === 0;
      })
      .addCase(fetchPlaces.rejected, (state, action) => {
        state.loading = false;
        state.cardLoading = false;
        state.error = action.payload as string;
        state.noResults = true;
        state.places = [];
        state.pagination = initialState.pagination;
      })
      
      
      // Fetch filter data
      .addCase(fetchFilterData.pending, (state) => {
        state.filterLoading = true;
        state.filterError = null;
      })
      .addCase(fetchFilterData.fulfilled, (state, action) => {
        state.filterLoading = false;
        state.filterData = action.payload;
      })
      .addCase(fetchFilterData.rejected, (state, action) => {
        state.filterLoading = false;
        state.filterError = action.payload as string;
      });
  },
});

export const {
  updateSelectedFilters,
  clearAllFilters,
  setListView,
  setSortBy,
  resetPlacesState,
} = placesSlice.actions;

export default placesSlice.reducer;

// Selectors
// FeatureArea selectors
export const selectPlaces = (state: { places: PlacesState }) => state.places.places;
export const selectPagination = (state: { places: PlacesState }) => state.places.pagination;
export const selectPlacesLoading = (state: { places: PlacesState }) => state.places.loading;
export const selectCardLoading = (state: { places: PlacesState }) => state.places.cardLoading;
export const selectPlacesError = (state: { places: PlacesState }) => state.places.error;
export const selectNoResults = (state: { places: PlacesState }) => state.places.noResults;

// FeatureSidebar selectors
export const selectFilterData = (state: { places: PlacesState }) => state.places.filterData;
export const selectSelectedFilters = (state: { places: PlacesState }) => state.places.selectedFilters;
export const selectFilterLoading = (state: { places: PlacesState }) => state.places.filterLoading;
export const selectFilterError = (state: { places: PlacesState }) => state.places.filterError;

// FeatureTop selectors
export const selectIsListView = (state: { places: PlacesState }) => state.places.isListView;
export const selectSortBy = (state: { places: PlacesState }) => state.places.sortBy;

export const { updateWishlistLocally } = placesSlice.actions;
