import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-hot-toast";

export interface Product {
  id: string;
  title?: string;
  price?: number;
  thumb?: string;
  location?: string;
  userId:string | null
}

interface WishlistState {
  wishlist: Product[];
  loading: boolean;
}

const initialState: WishlistState = {
  wishlist: [],
  loading: false,
};

const BASE_URL = import.meta.env.VITE_BASE_URL; 

export const addToWishlist = createAsyncThunk(
  "wishlist",
  async (
    { userId, packageId }: { userId: string; packageId: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axios.post(`${BASE_URL}/wishlist`, { userId, packageId },{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });

      const { action, place } = res.data;

      if (action === "added") {
        toast.success("Added to wishlist", { position: "top-right" });
      } else if (action === "removed") {
        toast.error("Removed from wishlist", { position: "top-right" });
      }

      return { action, packageId, place };
    } catch (err: any) {
      toast.error("Failed to update wishlist");
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// 🔹 Fetch wishlist
export const fetchWishlist = createAsyncThunk(
  "wishlist/fetch",
  async (userId: string, { rejectWithValue }) => {
    try {
      const res = await axios.get(`${BASE_URL}/wishlist/${userId}`,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      return res.data.data; 
    } catch (err: any) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const wishlistSlice = createSlice({
  name: "wishlist",
  initialState,
  reducers: {
    
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchWishlist.fulfilled, (state, action) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(fetchWishlist.rejected, (state) => {
        state.loading = false;
      })

      .addCase(addToWishlist.fulfilled, (state, action) => {
        const { action: serverAction, packageId, place } = action.payload;

        if (serverAction === "added") {
          // Add to wishlist in Redux
          state.wishlist.push(place);
        } else if (serverAction === "removed") {
          // Remove from wishlist
          state.wishlist = state.wishlist.filter((item) => item.id !== packageId);
        }
      });
  },
});

export default wishlistSlice.reducer;
