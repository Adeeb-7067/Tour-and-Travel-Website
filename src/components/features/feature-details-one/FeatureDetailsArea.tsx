import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import FeatureList from "./FeatureList";
import VideoPopup from "../../../modals/VideoPopup";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { fetchPackageById } from "../../../redux/features/placeDetailSlice";
import { addToWishlist } from "../../../redux/features/WishlistWorking";
import toast from "react-hot-toast";

const FeatureDetailsArea = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.placeDetail);

  const params = useParams();
  const packageId = params.id;

  useEffect(() => {
    if (!packageId) return;
    dispatch(fetchPackageById(packageId));
  }, [dispatch, packageId]);

  const [isVideoOpen, setIsVideoOpen] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);

  // Update wishlist status when data changes
  useEffect(() => {
    if (data?.id) {
      const savedWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      setIsWishlisted(savedWishlist.some((item: any) => item.id === data.id));
    }
  }, [data]);

  const averageRating = data?.ratings?.averageRating || 0;
  const totalReviews = data?.ratings?.totalReviews || 0;

  // Function to render stars
  const renderStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(
          <span key={i}>
            <i className="fa-sharp fa-solid fa-star text-warning"></i>
          </span>
        );
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(
          <span key={i}>
            <i className="fa-sharp fa-solid fa-star-half-stroke text-warning"></i>
          </span>
        );
      } else {
        stars.push(
          <span key={i}>
            <i className="fa-sharp fa-regular fa-star text-muted"></i>
          </span>
        );
      }
    }

    return stars;
  };

  // Wishlist functionality
  const handleAddToWishlist = async () => {
    if (!data?.id) return;

    const userId = localStorage.getItem("userId") ?? "";
    try {
      const savedWishlist = JSON.parse(
        localStorage.getItem("wishlist") || "[]"
      );
      const isCurrentlyWishlisted = savedWishlist.some(
        (item: any) => item.id === data.id
      );

      let updatedWishlist;
      if (isCurrentlyWishlisted) {
        // Remove from wishlist
        updatedWishlist = savedWishlist.filter(
          (item: any) => item.id !== data.id
        );
        setIsWishlisted(false);
      } else {
        // Add to wishlist
        updatedWishlist = [...savedWishlist, { ...data, isWishlist: true }];
        setIsWishlisted(true);
      }

      localStorage.setItem("wishlist", JSON.stringify(updatedWishlist));

      // Update Redux store
      dispatch({
        type: "places/updateWishlistLocally",
        payload: updatedWishlist,
      });

      // Update backend
      await dispatch(addToWishlist({ userId, packageId: data.id }) as any);

      // toast.success(isCurrentlyWishlisted ? "Removed from wishlist!" : "Added to wishlist!");
    } catch (err: any) {
      toast.error(err.message || "Failed to update wishlist");
      // Revert UI state on error
      setIsWishlisted(!isWishlisted);
    }
  };

  return (
    <>
      <div className="tg-tour-details-area pt-35 pb-25">
        <div className="container">
          <div className="row align-items-end mb-35">
            <div className="col-xl-9 col-lg-8">
              <div className="tg-tour-details-video-title-wrap">
                <h2 className="tg-tour-details-video-title mb-15">
                  {data?.packageName ||
                    "Vatican Museums Sistine Chapel Skip the Line"}
                </h2>
                <div className="tg-tour-details-video-location d-flex flex-wrap">
                  <span className="mr-25">
                    {" "}
                    duration : {data?.durationDays || 0}D /{" "}
                    {data?.durationNights}N
                  </span>
                  <div className="tg-tour-details-video-ratings d-flex align-items-center">
                    {renderStars(averageRating)}
                    <span className="review ms-2">
                      ({totalReviews}{" "}
                      {totalReviews === 1 ? "Review" : "Reviews"})
                    </span>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-3 col-lg-4">
              <div className="tg-tour-details-video-share text-end">
                <Link
                  to="#"
                  className="ml-25"
                  onClick={(e) => {
                    e.preventDefault();
                    handleAddToWishlist();
                  }}
                  style={{ cursor: "pointer" }}
                >
                  {isWishlisted ? (
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
                  {/* <svg 
                    width="16" 
                    height="14" 
                    viewBox="0 0 16 14" 
                    fill={isWishlisted ? "red" : "none"} 
                    xmlns="http://www.w3.org/2000/svg"
                    style={{ color: isWishlisted ? "red" : "currentColor" }}
                  >
                    <path 
                      d="M10.2606 10.7831L10.2878 10.8183L10.2606 10.7831L10.2482 10.7928C10.0554 10.9422 9.86349 11.0909 9.67488 11.2404C9.32643 11.5165 9.01846 11.7565 8.72239 11.9304C8.42614 12.1044 8.19324 12.1804 7.99978 12.1804C7.80633 12.1804 7.57342 12.1044 7.27718 11.9304C6.9811 11.7565 6.67312 11.5165 6.32472 11.2404C6.13618 11.091 5.94436 10.9423 5.75159 10.7929L5.73897 10.7831C4.90868 10.1397 4.06133 9.48294 3.36178 8.6911C2.51401 7.73157 1.92536 6.61544 1.92536 5.16811C1.92536 3.75448 2.71997 2.57143 3.80086 2.07481C4.84765 1.59384 6.26028 1.71692 7.61021 3.12673L7.64151 3.09675L7.61021 3.12673C7.7121 3.23312 7.85274 3.2933 7.99978 3.2933C8.14682 3.2933 8.28746 3.23312 8.38936 3.12673L8.35868 3.09736L8.38936 3.12673C9.73926 1.71692 11.1519 1.59384 12.1987 2.07481C13.2796 2.57143 14.0742 3.75448 14.0742 5.16811C14.0742 6.61544 13.4856 7.73157 12.6378 8.69109L12.668 8.71776L12.6378 8.6911C11.9382 9.48294 11.0909 10.1397 10.2606 10.7831ZM5.10884 11.6673L5.13604 11.6321L5.10884 11.6673L5.10901 11.6674C5.29802 11.8137 5.48112 11.9554 5.65523 12.0933C5.99368 12.3616 6.35981 12.6498 6.73154 12.8682L6.75405 12.8298L6.73154 12.8682C7.10315 13.0864 7.53174 13.2667 7.99978 13.2667C8.46782 13.2667 8.89641 13.0864 9.26802 12.8682L9.24552 12.8298L9.26803 12.8682C9.63979 12.6498 10.0059 12.3615 10.3443 12.0933C10.5185 11.9553 10.7016 11.8136 10.8907 11.6673L10.8907 11.6673L10.8926 11.6659C11.7255 11.0212 12.6722 10.2884 13.4463 9.41228L13.413 9.38285L13.4463 9.41227C14.4145 8.31636 15.1553 6.95427 15.1553 5.16811C15.1553 3.34832 14.1308 1.76808 12.6483 1.08693C11.2517 0.445248 9.53362 0.635775 7.99979 1.99784C6.46598 0.635775 4.74782 0.445248 3.35124 1.08693C1.86877 1.76808 0.844227 3.34832 0.844227 5.16811C0.844227 6.95427 1.58502 8.31636 2.55325 9.41227C3.32727 10.2883 4.27395 11.0211 5.10682 11.6657L5.10884 11.6673Z" 
                      fill={isWishlisted ? "red" : "currentColor"} 
                      
                    />
                  </svg> */}{" "}
                  {/* {isWishlisted ? "Added to Wishlist" : "Add to Wishlist"} */}
                </Link>
              </div>
            </div>
          </div>

          <div className="row gx-15 mb-25">
            <div className="col-lg-7">
              <div className="tg-tour-details-video-thumb mb-15">
                <img
                  className="w-100"
                  src={
                    data?.galleryImages[0] ||
                    "/assets/img/tour-details/thumb-4.jpg"
                  }
                  alt=""
                   onError={(e) => {
    e.currentTarget.src = "/assets/img/tour-details/thumb-4.jpg";
  }}
                />
              </div>
            </div>

            <div className="col-lg-5">
              <div className="row gx-15">
                <div className="col-12">
                  <div className="tg-tour-details-video-thumb mb-15">
                    <img
                      className="w-100"
                      src={
                        data?.galleryImages[1] ||
                        "/assets/img/tour-details/thumb-1.jpg"
                      }
                      alt=""
                       onError={(e) => {
    e.currentTarget.src = "/assets/img/tour-details/thumb-1.jpg"; 
  }}
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="tg-tour-details-video-thumb mb-15">
                    <img
                      className="w-100"
                      src={
                        data?.galleryImages[2] ||
                        "/assets/img/tour-details/thumb-2.jpg"
                      }
                      alt=""
                       onError={(e) => {
    e.currentTarget.src = "/assets/img/tour-details/thumb-2.jpg"; 
  }}
                    />
                  </div>
                </div>

                <div className="col-lg-6 col-md-6">
                  <div className="tg-tour-details-video-thumb mb-15">
                    <img
                      className="w-100"
                      src={
                        data?.galleryImages[3] ||
                        "/assets/img/tour-details/thumb-3.jpg"
                      }
                      alt=""
                       onError={(e) => {
    e.currentTarget.src = "/assets/img/tour-details/thumb-3.jpg";
  }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="tg-tour-details-feature-list-wrap">
            <div className="row align-items-center">
              <div className="col-lg-8">
                <div className="tg-tour-details-video-feature-list">
                  <FeatureList />
                </div>
              </div>
              <div className="col-lg-4">
                <div className="tg-tour-details-video-feature-price mb-15">
                  <p>
                    From <span>{data?.basePricePerPerson}</span> / Person
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <VideoPopup
        isVideoOpen={isVideoOpen}
        setIsVideoOpen={setIsVideoOpen}
        videoId="eEzD-Y97ges"
      />
    </>
  );
};

export default FeatureDetailsArea;
