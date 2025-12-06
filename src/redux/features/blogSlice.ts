import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import axios from 'axios';

// Updated Blog interface to match your API response
export interface Blog {
  _id: string;
  title: string;
  excerpt: string;
  content: string;
  coverImage: string;
  galleryImages: string[];
  videoLink: string;
  tags: string[];
  author: string;
  authorId: string;
  publishDate: string;
  status: string;
  isDisabled: boolean;
  isFeatured: boolean;
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string[];
  readingTime: number;
  relatedPlaceIds: string[];
  relatedPackageIds: string[];
  createdAt: string;
  updatedAt: string;
  slug: string;
  __v: number;
}

export interface BlogState {
  blogs: Blog[];
  currentBlog: Blog | null;
  loading: boolean;
  error: string | null;
  currentPage: number;
  totalPages: number;
  totalBlogs: number;
  searchQuery: string;
}

export interface BlogListApiResponse {
  success: boolean;
  message: string;
  data: Blog[];
  pagination: {
    totalItems: number;
    totalPages: number;
    currentPage: number;
    pageSize: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface SingleBlogApiResponse {
  success: boolean;
  message: string;
  data: Blog;
}

const BASE_URL = import.meta.env.VITE_BASE_URL;

export const fetchBlogs = createAsyncThunk(
  'blog/fetchBlogs',
  async ({ page = 1, limit = 10, q: searchQuery }: { page?: number; limit?: number, q?: string } = {}) => {
    const params: any = { page, limit };
    if (searchQuery && searchQuery.trim() !== '') {
      params.q = searchQuery;
    }
    
    const response = await axios.get<BlogListApiResponse>(`${BASE_URL}/blogs`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
      params,  // Only include q if it has value
    });
    return response.data;
  }
);

export const fetchBlogBySlug = createAsyncThunk(
  'blog/fetchBlogBySlug',
  async (slug: string) => {
    const response = await axios.get<SingleBlogApiResponse>(`${BASE_URL}/blogs/slug/${slug}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`,
      },
    });
    return response.data.data;
  }
);

const initialState: BlogState = {
  blogs: [],
  currentBlog: null,
  loading: false,
  error: null,
  currentPage: 1,
  totalPages: 1,
  totalBlogs: 0,
  searchQuery: '',
};

 const blogSlice = createSlice({
  name: 'blog',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    setSearch:(state,action)=>{
      state.searchQuery=action.payload
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch Blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.blogs = action.payload.data;
        state.totalBlogs = action.payload.pagination.totalItems;
        state.totalPages = action.payload.pagination.totalPages;
        state.currentPage = action.payload.pagination.currentPage;
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch blogs';
      })
      // Fetch Blog by Slug
      .addCase(fetchBlogBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogBySlug.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlogBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch blog';
      });

  },
});

export const { clearError, setCurrentPage, clearCurrentBlog,setSearch } = blogSlice.actions;
export default blogSlice.reducer;