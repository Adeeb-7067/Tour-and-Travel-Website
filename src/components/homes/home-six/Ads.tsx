import { Link } from "react-router-dom";
import Button from "../../common/Button";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { fetchHomeData } from "../../../redux/features/homeSlice";
import { useEffect, useMemo, useState } from "react";

// ✅ Hook to auto-handle broken image URLs
const useImageFallback = (src: string, fallback: string) => {
  const [imgSrc, setImgSrc] = useState(src || fallback);

  useEffect(() => {
    if (!src) {
      setImgSrc(fallback);
      return;
    }

    const img = new Image();
    img.src = src;
    img.onload = () => setImgSrc(src);
    img.onerror = () => setImgSrc(fallback);
  }, [src, fallback]);

  return imgSrc;
};

// ✅ Type definitions
type BannerItem = {
  _id: string;
  title: string;
  subtitle: string;
  percentDiscount: number;
  imageUrl: string;
};

type BannerData = BannerItem[];

// ✅ Local fallback data (if API fails or is empty)
const fallbackBannerData: BannerData = [
  {
    _id: "1",
    title: "Summer Special",
    subtitle: "Enjoy amazing discounts on summer trips",
    percentDiscount: 12,
    imageUrl: "/assets/img/ads/destination-1.jpg",
  },
  {
    _id: "2",
    title: "Flight Deals",
    subtitle: "Strike The Deal With Used Payments",
    percentDiscount: 5,
    imageUrl: "/assets/img/ads/destination-2.jpg",
  },
  {
    _id: "3",
    title: "Extra Discount",
    subtitle: "Limited time offer on selected destinations",
    percentDiscount: 25,
    imageUrl: "/assets/img/ads/destination-3.jpg",
  },
];

const Ads = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.home);

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  // ✅ Extract API data safely
  const apiBannerData = useMemo(() => {
    const apiItem = data?.find((item: any) => item._id === "OFFER");
    return Array.isArray(apiItem?.banners) ? apiItem.banners : [];
  }, [data]);

  // ✅ Choose display data: API or fallback
  const displayData = apiBannerData.length > 0 ? apiBannerData : fallbackBannerData;
  const isUsingFallback = apiBannerData.length === 0 || !!error;

  // ✅ Normalize all items with safe fallback values
  const customizedData = displayData.slice(0, 3).map((item: BannerItem, index: number) => ({
    title: item?.title || `Special Offer ${index + 1}`,
    subtitle: item?.subtitle || "Amazing deals waiting for you",
    percentDiscount: item?.percentDiscount || [12, 5, 25][index],
    imageUrl: item?.imageUrl || `/assets/img/ads/destination-${index + 1}.jpg`,
    id: item?._id || `fallback-${index}`,
  }));

  // ✅ Fallback-safe image URLs
  const img1 = useImageFallback(customizedData[0]?.imageUrl, "/assets/img/ads/destination-1.jpg");
  const img2 = useImageFallback(customizedData[1]?.imageUrl, "/assets/img/ads/destination-2.jpg");
  const img3 = useImageFallback(customizedData[2]?.imageUrl, "/assets/img/ads/destination-3.jpg");

  // ✅ Show loading placeholders
  if (loading && !data) {
    return (
      <div className="tg-ads-area pt-90 p-relative z-index-1">
        <div className="container">
          <div className="row">
            {[1, 2, 3].map((item) => (
              <div key={item} className="col-lg-4 col-md-6 mb-30">
                <div
                  className="tg-ads-wrap include-bg fix"
                  style={{
                    background: "#f0f0f0",
                    minHeight: "200px",
                    borderRadius: "8px",
                  }}
                >
                  <div className="text-center p-4">
                    <div className="spinner-border text-primary" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2 mb-0">Loading offers...</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tg-ads-area pt-90 p-relative z-index-1">
      <div className="container">
        <div className="row">

          {/* 1️⃣ First Banner */}
          <div className="col-lg-4 col-md-6 mb-30">
            <div
              className="tg-ads-wrap include-bg fix"
              style={{
                backgroundImage: `url(${img1})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "200px",
                borderRadius: "8px",
              }}
            >
              <div className="row">
                <div className="col-xl-6 col-4"></div>
                <div className="col-xl-6 col-8">
                  <div className="tg-ads-content text-center ml-20">
                    <div className="tg-ads-upto p-relative text-center mb-30">
                      <h2 className="mb-0">{customizedData[0]?.percentDiscount || 12}%</h2>
                      <span className="saving">Savings</span>
                      <div className="upto">up to</div>
                    </div>
                    <div className="tg-ads-btn">
                      <Link
                        to="/tour-grid-1"
                        className="tg-btn tg-btn-switch-animation"
                        style={{ width: "150px", padding: "5px" }}
                      >
                        <Button text="See Details" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 2️⃣ Second Banner */}
          <div className="col-lg-4 col-md-6 mb-30">
            <div
              className="tg-ads-wrap-2 include-bg fix"
              style={{
                backgroundImage: `url(${img2})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "200px",
                borderRadius: "8px",
              }}
            >
              <div className="tg-ads-content-2 text-center">
                <h5 className="mb-0">
                  {customizedData[1]?.title || "Flight Deals"}
                </h5>
                <div className="tg-ads-discount-inner d-flex align-items-center justify-content-center">
                  <h2 className="mb-0">{customizedData[1]?.percentDiscount || 5}%</h2>
                  <div className="tg-ads-discount">
                    <h3 className="mb-0">Extra</h3>
                    <span>Discount</span>
                  </div>
                </div>
                <Link to="/tour-grid-1">
                  {customizedData[1]?.subtitle || "Amazing flight savings"}
                </Link>
              </div>
            </div>
          </div>

          {/* 3️⃣ Third Banner */}
          <div className="col-lg-4 col-md-6 mb-30">
            <div
              className="tg-ads-wrap-3 include-bg fix"
              style={{
                backgroundImage: `url(${img3})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                minHeight: "200px",
                borderRadius: "8px",
              }}
            >
              <div className="tg-ads-content-2">
                <div className="tg-ads-discount-inner mb-5">
                  <h2 className="mb-0">{customizedData[2]?.percentDiscount || 25}%</h2>
                  <div className="tg-ads-discount">
                    <h3 className="mb-0">Extra</h3>
                    <span>Discount</span>
                  </div>
                </div>
                <div className="tg-ads-btn">
                  <Link to="/tour-grid-1" className="tg-btn tg-btn-switch-animation">
                    <Button text="See Details" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ⚠️ Error or Fallback Message */}
        {isUsingFallback && (
          <div className="row">
            <div className="col-12">
              <div className="alert alert-warning text-center mt-3" role="alert">
                <small>
                  Showing demo content — API data unavailable.
                  {error && ` Error: ${error}`}
                </small>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Ads;
