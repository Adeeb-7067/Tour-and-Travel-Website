/* eslint-disable @typescript-eslint/no-explicit-any */
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination } from "swiper/modules";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Button from "../../common/Button";
import type { AppDispatch, RootState } from "../../../redux/store";
import { useEffect, useMemo, useState } from "react";
import { fetchHomeData } from "../../../redux/features/homeSlice";
import { addToWishlist } from "../../../redux/features/WishlistWorking";
import thumbnailImage from "../../../../public/assets/img/destination/des-4.jpg";
import toast from "react-hot-toast";

const setting = {
  spaceBetween: 25,
  loop: true,
  speed: 500,
  autoplay: {
    delay: 4000,
  },
  pagination: {
    el: ".swiper-pagination",
  },
  navigation: false,
  breakpoints: {
    "1200": {
      slidesPerView: 4,
    },
    "992": {
      slidesPerView: 3,
    },
    "768": {
      slidesPerView: 2,
    },
    "576": {
      slidesPerView: 1,
    },
    "0": {
      slidesPerView: 1,
    },
  },
};

interface ListingItem {
  id: string;
  title: string;
  rating: number;
  address: string;
  price: number;
  coverImage: string;
  city: string;
  totalReviews: number;
  category?: string;
  isWishlist?: boolean;
  thumb?: string;
  location?: string;
  duration?: string;
  tag?: string;
  featured?: string;
  offer?: string;
}

const  Listing = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.home
  );
  const [listingData, setListingData] = useState<ListingItem[]>([]);

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  const apiListingData = useMemo(() => {
    const apiItem = data?.find((item: any) => item._id === "popularTour");
    return apiItem?.banners || [];
  }, [data]);

// Initialize listing data with wishlist status - Simplified version
useEffect(() => {
  if (apiListingData.length > 0) {
 
console.log(apiListingData)
    const initializedData = apiListingData.slice(0, 8).map((item: any) => ({
      id: item._id,
      title: item.packageName,
      rating: item.ratings.averageRating,
      address: item.address,
      price: item.basePricePerPerson,
      coverImage: item.coverImage,
      city: item.cities[0]?.cityName || "Unknown City",
      totalReviews: item.ratings.totalReviews || 0,
      category: item.category,
      location: item.city?.cityName || "Unknown City",
      thumb: item.coverImage,
      isWishlist:item.isWishlist, // Simplified check
    }));

    setListingData(initializedData);
  }
}, [apiListingData]);

  // Simple and effective wishlist handler with useState
// Simplified wishlist functionality like FeatureDetailsArea
const handleAddToWishlist = async (item: ListingItem) => {
  if (!item?.id) return;
  
  const userId = localStorage.getItem("userId") ?? "";
  try {
    const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    const isCurrentlyWishlisted = savedWishlist.some((wish: any) => wish.id === item.id);
    
    let updatedWishlist;
    if (isCurrentlyWishlisted) {
      // Remove from wishlist
      updatedWishlist = savedWishlist.filter((wish: any) => wish.id !== item.id);
    } else {
      // Add to wishlist
      updatedWishlist = [...savedWishlist, { ...item, isWishlist: true }];
    }
    
    // Update localStorage
    localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

    // Update local state
    setListingData(prevData =>
      prevData.map(listingItem =>
        listingItem.id === item.id
          ? { ...listingItem, isWishlist: !isCurrentlyWishlisted }
          : listingItem
      )
    );

    // Update Redux store
    dispatch({ 
      type: "listing/updateWishlistLocally", 
      payload: { itemId: item.id, isWishlist: !isCurrentlyWishlisted } 
    });

    // Update backend
    await dispatch(addToWishlist({ userId, packageId: item.id }) as any);

    // Optional: Show toast message
    // toast.success(isCurrentlyWishlisted ? "Removed from wishlist!" : "Added to wishlist!");
  } catch (err: any) {
    // Revert UI state on error
    setListingData(prevData =>
      prevData.map(listingItem =>
        listingItem.id === item.id
          ? { ...listingItem, isWishlist: !listingItem.isWishlist }
          : listingItem
      )
    );
    
    toast.error(err.message || "Failed to update wishlist");
  }
};
  // Listen for wishlist updates from other components
//   useEffect(() => {
//     const handleWishlistUpdate = () => {
//       const savedWishlist = JSON.parse(
//         localStorage.getItem("wishlist") || "[]"
//       );
//       const wishlistIds = new Set(savedWishlist.map((item: any) => item.id));

//       setListingData((prevData) =>
//         prevData.map((item) => ({
//           ...item,
//           isWishlist: wishlistIds.has(item.id),
//         }))
//       );
//     };

//     // Listen for storage events (changes from other tabs)
//     window.addEventListener("storage", handleWishlistUpdate);

//     // Listen for custom events (changes from same app)
//     window.addEventListener("wishlistUpdated", handleWishlistUpdate);

//     return () => {
//       window.removeEventListener("storage", handleWishlistUpdate);
//       window.removeEventListener("wishlistUpdated", handleWishlistUpdate);
//     };
//   }, []);

  if (loading) {
    return (
      <div className="tg-listing-area pt-110 pb-115 p-relative z-index-9">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p>Loading popular tours...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tg-listing-area pt-110 pb-115 p-relative z-index-9">
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <p>Error loading data: {error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tg-listing-area pt-110 pb-115 p-relative z-index-9">
      <img
        className="tg-listing-3-shape tg-listing-4-shape d-none d-xl-block"
        src="/assets/img/banner/banner-2/shape.png"
        alt=""
      />
      <div className="container">
        <div className="row align-items-end">
          <div className="col-lg-9">
            <div className="tg-location-section-title mb-40">
              <h5
                className="tg-section-subtitle mb-15 wow fadeInUp"
                data-wow-delay=".4s"
                data-wow-duration=".9s"
              >
                Most Popular Tour Packages{" "}
              </h5>
              <h2
                className="mb-15 text-capitalize wow fadeInUp"
                data-wow-delay=".5s"
                data-wow-duration=".9s"
              >
                Our Popular Tours
              </h2>
            </div>
          </div>
          <div className="col-lg-3">
            <div
              className="tg-location-3-btn text-end wow fadeInUp mb-40"
              data-wow-delay=".6s"
              data-wow-duration=".9s"
            >
              <Link
                to="/tour-grid-1"
                className="tg-btn tg-btn-gray tg-btn-switch-animation"
              >
                <Button text="See All Deal" />
              </Link>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-12">
            <Swiper
              {...setting}
              modules={[Autoplay, Pagination]}
              wrapperClass="mb-35"
              className="swiper-container tg-listing-slider p-relative fix mb-35"
            >
              {listingData.map((item) => (
                <SwiperSlide key={item.id} className="swiper-slide">
                  <div className="tg-listing-card-item tg-listing-4-card-item mb-25">
                    <div className="tg-listing-card-thumb tg-listing-2-card-thumb mb-15 fix p-relative">
                      <Link to={`/tour-details/${item.id}`}>
                        <img
                          className="tg-card-border w-100"
                          src={item.coverImage || thumbnailImage}
                          alt={item.title}
                          style={{ height: "200px", objectFit: "cover" }}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.src = thumbnailImage;
                          }}
                        />
                      </Link>
                      <div className="tg-listing-2-price">
                        <span className="new">{item.price}</span>
                        <span className="shift">/person</span>
                      </div>
                    </div>
                    <div className="tg-listing-card-content p-relative">
                      <h4 className="tg-listing-card-title mb-5">
                        <Link
                          to={`/tour-details/${item.id}`}
                          title={item.title}
                        >
                          {item.title.slice(0, 15)}
                          {item.title.length > 15 ? "..." : ""}
                        </Link>
                      </h4>

                      <span
                        className="tg-listing-card-duration-map d-inline-flex align-items-center gap-1"
                        title={item.city} // <-- Tooltip added
                        style={{
                          maxWidth: "120px", // adjust width as needed
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        <svg
                          width="13"
                          height="16"
                          viewBox="0 0 13 16"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.3329 6.7071C12.3329 11.2324 6.55512 15.1111 6.55512 15.1111C6.55512 15.1111 0.777344 11.2324 0.777344 6.7071C0.777344 5.16402 1.38607 3.68414 2.46962 2.59302C3.55316 1.5019 5.02276 0.888916 6.55512 0.888916C8.08748 0.888916 9.55708 1.5019 10.6406 2.59302C11.7242 3.68414 12.3329 5.16402 12.3329 6.7071Z"
                            stroke="currentColor"
                            strokeWidth="1.15556"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                          <path
                            d="M6.55512 8.64649C7.61878 8.64649 8.48105 7.7782 8.48105 6.7071C8.48105 5.636 7.61878 4.7677 6.55512 4.7677C5.49146 4.7677 4.6292 5.636 4.6292 6.7071C4.6292 7.7782 5.49146 8.64649 6.55512 8.64649Z"
                            stroke="currentColor"
                            strokeWidth="1.15556"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>

                        {item.city}
                      </span>

                      <div className="tg-listing-card-review mb-10">
                        {[...Array(5)].map((_, index) => (
                          <span key={index} className="tg-listing-rating-icon">
                            <i
                              className={`fa-sharp fa-solid fa-star ${
                                index < Math.floor(item.rating)
                                  ? "text-warning"
                                  : "text-muted"
                              }`}
                            ></i>
                          </span>
                        ))}
                        <span className="tg-listing-rating-percent">
                          ({item.totalReviews} Reviews)
                        </span>
                      </div>
                      <div className="d-flex justify-content-between">
                        <div className="tg-listing-avai d-flex align-items-center justify-content-between">
                          <Link
                            className="tg-listing-avai-btn"
                            to={`/tour-details/${item.id}`}
                          >
                            Check Availability
                          </Link>
                        </div>
                        {/* Wishlist Button */}
                        <div className="tg-listing-item-wishlist">
                          <a
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToWishlist(item);
                            }}
                            style={{ cursor: "pointer" }}
                          >
                            {item.isWishlist ? (
                              <svg
                                width="20"
                                height="18"
                                viewBox="0 0 20 18"
                                fill="red"
                                style={{ color: "red" }}
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.5167 16.3416C10.2334 16.4416 9.76675 16.4416 9.48341 16.3416C7.06675 15.5166 1.66675 12.075 1.66675 6.24165C1.66675 3.66665 3.74175 1.58331 6.30008 1.58331C7.81675 1.58331 9.15841 2.31665 10.0001 3.44998C10.8417 2.31665 12.1917 1.58331 13.7001 1.58331C16.2584 1.58331 18.3334 3.66665 18.3334 6.24165C18.3334 12.075 12.9334 15.5166 10.5167 16.3416Z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            ) : (
                              <svg
                                width="20"
                                height="18"
                                viewBox="0 0 20 18"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                              >
                                <path
                                  d="M10.5167 16.3416C10.2334 16.4416 9.76675 16.4416 9.48341 16.3416C7.06675 15.5166 1.66675 12.075 1.66675 6.24165C1.66675 3.66665 3.74175 1.58331 6.30008 1.58331C7.81675 1.58331 9.15841 2.31665 10.0001 3.44998C10.8417 2.31665 12.1917 1.58331 13.7001 1.58331C16.2584 1.58331 18.3334 3.66665 18.3334 6.24165C18.3334 12.075 12.9334 15.5166 10.5167 16.3416Z"
                                  stroke="currentColor"
                                  strokeWidth="1.5"
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                />
                              </svg>
                            )}
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
              <div className="tg-listing-4-pagination swiper-pagination"></div>
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Listing;
