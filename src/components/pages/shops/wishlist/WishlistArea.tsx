/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { useState, useEffect } from "react";
import { addToWishlist, fetchWishlist } from "../../../../redux/features/WishlistWorking";

const WishlistArea = () => {
  const dispatch = useDispatch();
  const [wishlistItems, setWishlistItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem("userId");

  const getWishlist = async () => {
    if (!userId) return;
    setLoading(true);
    try {
      const data = await dispatch(fetchWishlist(userId) as any) 
      console.log(data,"Wishlist")
      setWishlistItems(data.payload.packageId || [])
    } catch (err: any) {
      toast.error(err.message || "Failed to fetch wishlist");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getWishlist();
  }, []);

  // ✅ Remove from wishlist (toggle API)
  const handleRemoveFromWishlist = async (placeId: any) => {
    if (!userId) return;
    try {
      await dispatch(addToWishlist({ userId, packageId: placeId }) as any)
      toast.success("Removed from wishlist");
      setWishlistItems((prev) => prev.filter((item) => item.id !== placeId));
    } catch (err: any) {
      toast.error(err.message || "Failed to remove item");
    }
  };

  return (
    <div className="cart-area pb-100 pt-105">
      <div className="container">
        <div className="row">
          <div className="col-12">
            {loading ? (
              <p className="text-center py-5">Loading wishlist...</p>
            ) : wishlistItems.length === 0 ? (
              <div className="mb-30">
                <div className="empty_bag text-center">
                  <p className="py-3">Your Wishlist is Empty</p>
                  <Link to={"/tour-grid-1"} className="tg-btn">
                    Go To Features
                  </Link>
                </div>
              </div>
            ) : (
              <form onClick={(e) => e.preventDefault()}>
                <div className="row gutter-y-30 gx-5">
                  <div className="tg-cart-table-content table-responsive mb-30">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>Item</th>
                          <th className="price">Price</th>
                          <th className="product-quantity">Add to Cart</th>
                          <th>Remove</th>
                        </tr>
                      </thead>
                      <tbody>
                        {wishlistItems.map((item: any, i: any) => (
                          <tr key={i}>
                            <td className="product-thumbnail">
                              <Link className="thumb" to={`/tour-details/${item.id}`}>
                                <img src={item.coverImage} alt={item.packageName.slice(0,5)} />
                              </Link>
                              <Link className="texts" to={`/tour-details/${item.id}`}>
                                {item.packageName}
                              </Link>
                            </td>
                            <td className="product-price2">
                              <span className="amount">{item.basePricePerPerson  || 'Price not Available'}</span>
                            </td>
                            <td className="product-add-to-cart">
                              <Link to={`/tour-details/${item.id}`}>
                              <button
                                className="tg-btn"
                                >
                                Book Now
                              </button>
                                </Link>
                            </td>
                            <td className="product-remove">
                              <a
                                onClick={() => handleRemoveFromWishlist(item.id)}
                                style={{ cursor: "pointer" }}
                              >
                                <i className="fa fa-times"></i>
                              </a>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistArea;
