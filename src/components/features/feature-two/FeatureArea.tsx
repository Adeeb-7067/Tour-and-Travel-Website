// FeatureArea.tsx
/* eslint-disable @typescript-eslint/no-explicit-any */
import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ReactPaginate from "react-paginate";
import FeatureTop from "./FeatureTop";
import FeatureSidebar from "./FeatureSidebar";
import { addToWishlist } from "../../../redux/features/WishlistWorking";
import {
  fetchPlaces,
  selectPlaces,
  selectPagination,
  selectPlacesLoading,
  selectCardLoading,
  selectPlacesError,
  selectNoResults,
  selectSelectedFilters,
  selectIsListView,
} from "../../../redux/features/placeSlice";
import thumbnailImage from "./../../../../public/assets/img/banner/thumb.jpg";
import toast from "react-hot-toast";

const FeatureArea = () => {
  const dispatch = useDispatch();

  // 🔹 Redux State
  const products = useSelector(selectPlaces);
  const pagination = useSelector(selectPagination);
  const loading = useSelector(selectPlacesLoading);
  const cardLoading = useSelector(selectCardLoading);
  const error = useSelector(selectPlacesError);
  const noResults = useSelector(selectNoResults);
  const activeFilters = useSelector(selectSelectedFilters);
  const isListView = useSelector(selectIsListView);
console.log(products)
  // 🔹 Initial data fetch
  useEffect(() => {
    dispatch(fetchPlaces({ page: 1, filters: {}, isInitial: true }) as any);
  }, [dispatch]);
  
  useEffect(() => {
  const savedWishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
  if (savedWishlist.length > 0) {
    dispatch({ type: "places/mergeWishlist", payload: savedWishlist });
  }
}, [dispatch]);


  // 🔹 Handle filter changes from sidebar
  const handleFilterChange = (filters: any) => {
    dispatch(fetchPlaces({ page: 1, filters }) as any);
  };

  // 🔹 Clear all filters
  // const handleClearFilters = () => {
  //   dispatch(fetchPlaces({ page: 1, filters: {} }) as any);
  // };

  const handlePageClick = ({ selected }: { selected: number }) => {
    const nextPage = selected + 1;
    dispatch(fetchPlaces({ page: nextPage, filters: activeFilters }) as any);
  };

const handleAddToWishlist = async (item: any) => {
  
  const userId = localStorage.getItem("userId") ?? "";
  try {
    const updatedProducts = products.map((p: any) =>
      p.id === item.id ? { ...p, isWishlist: !p.isWishlist } : p
    );

    // Optional: persist in localStorage for faster reload
    localStorage.setItem("wishlist", JSON.stringify(updatedProducts.filter(p => p.isWishlist)));

    // 2️⃣ Dispatch to Redux store if needed
    dispatch({ type: "places/updateWishlistLocally", payload: updatedProducts });

    // 3️⃣ Update backend asynchronously
    await dispatch(addToWishlist({ userId, packageId: item.id }) as any);

    toast.success("Wishlist updated!");
  } catch (err: any) {
    toast.error(err.message || "Failed to update wishlist");
  }
};



  // 🔹 Card Skeleton Loader
  const CardSkeleton = () => (
    <div className="col-xxl-4 col-xl-6 col-lg-6 col-md-6 tg-grid-full">
      <div className="tg-listing-card-item mb-30 animate-pulse">
        <div
          className="bg-gray-700 rounded-lg w-100 mb-3"
          style={{
            height: "240px",
            backgroundColor: "gray",
            opacity: "40%",
            borderRadius: "30px",
          }}
        ></div>
        <div className="bg-gray-200 h-4 w-3/4 mb-2 rounded"></div>
        <div className="bg-gray-200 h-4 w-1/2 rounded"></div>
      </div>
    </div>
  );

  // 🔹 Loading and Error States
  if (loading)
    return (
      <div className="text-center py-10 text-lg font-medium">
        Loading places...
      </div>
    );

  if (error)
    return (
      <div className="text-center py-10 text-red-600 font-medium">
        Error loading data: {error}
      </div>
    );

  // 🔹 Render
  return (
    <div className="tg-listing-grid-area mb-85 mt-40">
      <div className="container">
        <div className="row">
          <FeatureSidebar onFilterChange={handleFilterChange} />

          <div className="col-xl-9 col-lg-8">
            <div className="tg-listing-item-box-wrap ml-10">
              {/* Active Filters Display */}
              {(
                [
                  "cities",
                  "countries",
                  "ratings",
                  "durations",
                  "prices",
                ] as (keyof typeof activeFilters)[]
              ).some(
                (key) => activeFilters[key] && activeFilters[key].length > 0
              ) && (
                <div className="active-filters mb-3 p-3 bg-light rounded">
                  <div className="d-flex justify-content-between align-items-center">
                    <div>
                      <strong>Active Filters:</strong>
                      {activeFilters.cities &&
                        activeFilters.cities.length > 0 && (
                          <span className="badge text-primary ms-2">
                            Cities: {activeFilters.cities.length}
                          </span>
                        )}
                      {activeFilters.countries &&
                        activeFilters.countries.length > 0 && (
                          <span className="badge text-primary ms-2">
                            Countries: {activeFilters.countries.length}
                          </span>
                        )}
                      {activeFilters.ratings &&
                        activeFilters.ratings.length > 0 && (
                          <span className="badge text-primary ms-2">
                            Ratings: {activeFilters.ratings.length}
                          </span>
                        )}
                      {activeFilters.durations &&
                        activeFilters.durations.length > 0 && (
                          <span className="badge text-primary ms-2">
                            Durations: {activeFilters.durations.length}
                          </span>
                        )}
                      {activeFilters.prices &&
                        activeFilters.prices.length >0  && (
                          <span className="badge text-primary ms-2">
                            Prices: {activeFilters.prices.length}
                          </span>
                        )}
                    </div>
                  </div>
                </div>
              )}

              <FeatureTop
                startOffset={
                  (pagination.currentPage - 1) * pagination.pageSize + 1
                }
                endOffset={Math.min(
                  pagination.currentPage * pagination.pageSize,
                  pagination.totalItems
                )}
                totalItems={pagination.totalItems}
              />

              <div className="tg-listing-grid-item">
                {noResults && !loading && (
                  <div className="text-center py-10" >
                    <h4>No Packages found matching your filters</h4>
                    <p className="text-muted mb-3">
                      Try adjusting your filters 
                    </p>
                  </div>
                )}

                {/* Results Grid */}
                {!noResults && (
                  <>
                    <div
                      className={`row list-card ${
                        isListView ? "list-card-open" : ""
                      }`}
                    >
                      {cardLoading
                        ? Array.from({ length: 9 }).map((_, idx) => (
                            <CardSkeleton key={idx} />
                          ))
                        : products.map((item) => (
                            <div
                              key={item.id}
                              className="col-xxl-4 col-xl-6 col-lg-6 col-md-6 tg-grid-full"
                            >
                              <Link to={`/tour-details/${item.id}`}>
                                <div className="tg-listing-card-item mb-30">
                                  <div className="tg-listing-card-thumb fix mb-15 p-relative">
                                    <img
                                      className="tg-card-border "
                                      src={item.thumb || thumbnailImage}
                                      alt={item.title}
                                      style={{ height: "200px",width:"400px" }}
                                      onError={(e) => {
                                        e.currentTarget.onerror = null; // prevent infinite loop
                                        e.currentTarget.src = thumbnailImage;
                                      }}
                                    />
                                    {item.tag && (
                                      <span className="tg-listing-item-price-discount shape">
                                        {item.tag}
                                      </span>
                                    )}
                                    {/* {item.featured && (
                                      <span className="tg-listing-item-price-discount shape-3">
                                        <svg
                                          width="12"
                                          height="14"
                                          viewBox="0 0 12 14"
                                          fill="none"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <path
                                            d="M6.60156 1L0.601562 8.2H6.00156L5.40156 13L11.4016 5.8H6.00156L6.60156 1Z"
                                            stroke="white"
                                            strokeWidth="0.857143"
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                          />
                                        </svg>
                                        {item.featured}
                                      </span>
                                    )} */}
                                    {item.offer && (
                                      <span className="tg-listing-item-price-discount offer-btm shape-2">
                                        {item.offer}
                                      </span>
                                    )}

                                    <div className="tg-listing-item-wishlist">
                                      <a
                                        onClick={(e) => {
                                          e.preventDefault();
                                          handleAddToWishlist(item);
                                        }}
                                        style={{ cursor: "pointer" }}
                                      >
                                        {item.isWishlist ? (
                                          <>
                                            <svg
                                              width="20"
                                              height="18"
                                              viewBox="0 0 20 18"
                                              fill="red"
                                              style={{
                                                color: "red",
                                              }}
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
                                          </>
                                        ) : (
                                          <>
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
                                          </>
                                        )}
                                      </a>
                                    </div>
                                  </div>

                                  <div className="tg-listing-main-content">
                                    <div className="tg-listing-card-content">
                                      <h4 className="tg-listing-card-title">
                                        <Link to={`/tour-details/${item.id}`}>
                                          {item.title}
                                        </Link>
                                      </h4>

                                      <div className="tg-listing-card-duration-tour">
                                        <span className="tg-listing-card-duration-map ">
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
                                          {item.location}
                                        </span>

                                        <span className="tg-listing-card-duration-time">
                                          <svg
                                            width="16"
                                            height="16"
                                            viewBox="0 0 16 16"
                                            fill="none"
                                            xmlns="http://www.w3.org/2000/svg"
                                          >
                                            <path
                                              d="M8.00175 3.73329V7.99996L10.8462 9.42218M15.1128 8.00003C15.1128 11.9274 11.9291 15.1111 8.00174 15.1111C4.07438 15.1111 0.890625 11.9274 0.890625 8.00003C0.890625 4.07267 4.07438 0.888916 8.00174 0.888916C11.9291 0.888916 15.1128 4.07267 15.1128 8.00003Z"
                                              stroke="currentColor"
                                              strokeWidth="1.06667"
                                              strokeLinecap="round"
                                              strokeLinejoin="round"
                                            />
                                          </svg>
                                          {item.duration}
                                        </span>
                                      </div>
                                    </div>

                                    <div className="tg-listing-card-price d-flex  justify-content-between">
                                      <div className="tg-listing-card-price-wrap price-bg d-flex align-items-center">
                                      <span className="tg-listing-card-currency-amount mr-5" style={{
                                        color:"#000",
                                        fontSize:'12px',
                                        
                                      }}>
                                        <span className="currency-symbol" style={{
                                          color:'#000'
                                        }}></span>
                                        {item.price}
                                      </span>
                                      <span className="tg-listing-card-activity-person" style={{
                                        color:'#000'
                                      }}>
                                        /Person
                                      </span>
                                    </div>

                                      <div className="tg-listing-card-review space">
                                        <span className="tg-listing-rating-icon">
                                          <i className="fa-sharp fa-solid fa-star"></i>
                                        </span>
                                        <span className="tg-listing-rating-percent">
                                          ({item.total_review} )
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </Link>
                            </div>
                          ))}
                    </div>

                    {/* Pagination */}
                    {pagination.totalPages > 1 && (
                      <div className="tg-pagenation-wrap text-center mt-50 mb-30">
                        <nav>
                          <ReactPaginate
                            breakLabel="..."
                            nextLabel={<i className="p-btn">Next Page</i>}
                            onPageChange={handlePageClick}
                            pageRangeDisplayed={3}
                            pageCount={pagination.totalPages}
                            previousLabel={
                              <i className="p-btn">Previous Page</i>
                            }
                            renderOnZeroPageCount={null}
                            forcePage={pagination.currentPage - 1}
                          />
                        </nav>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeatureArea;
