import { configureStore } from "@reduxjs/toolkit";
import cartSlice, { hydrateCart } from "./features/cartSlice";
import productSlice from "./features/productSlice";
import blogSlice from "./features/blogSlice";
import companySlice from './features/companySlice'
import PlaceSlice from './features/placeSlice'
import WishlistWorking from './features/WishlistWorking'
import reviewSlice from './features/reviewSlice'
import homeSlice from './features/homeSlice'
import aboutSlice from './features/aboutSlice';
import placeDetailSlice from './features/placeDetailSlice'
import { tokenExpirationMiddleware } from "./MiddleWare/tokenExpire";
const store = configureStore({
   reducer: {
      company:companySlice,    
      products: productSlice,
      cart: cartSlice,
      wishlist: WishlistWorking,
      blog: blogSlice,
      places:PlaceSlice,
      review:reviewSlice,
      home:homeSlice,
      about:aboutSlice,
      placeDetail:placeDetailSlice
   },
   middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(tokenExpirationMiddleware),
});

store.dispatch(hydrateCart());
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export default store;
