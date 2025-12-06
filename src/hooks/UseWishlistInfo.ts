import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
// Use the Product type from WishlistWorking to match the wishlist state
import type { Product } from "../redux/features/WishlistWorking";

const UseWishlistInfo = () => {
   const [wishlistItems, setWishlistItems] = useState<Product[]>([]);
   const wishlist = useSelector((state: RootState) => state.wishlist.wishlist);

   useEffect(() => {
      setWishlistItems(wishlist);
   }, [wishlist]);

   return {
      wishlistItems,
   };
}

export default UseWishlistInfo;