import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { fetchHomeData } from "../../../redux/features/homeSlice";
import { useEffect, useState, useMemo } from "react";

const Banner = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading } = useSelector((state: RootState) => state.home);

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  const bannerData = useMemo(() => {
    const apiItem = data?.find((item: any) => item._id === "HERO");
    return apiItem?.banners?.[0] || null;
  }, [data]);

  const [bgImage, setBgImage] = useState("/assets/img/hero/hero-4/hero-4.jpg");

  useEffect(() => {
    if (bannerData?.imageUrl) {
      const img = new Image();
      img.src = bannerData.imageUrl;
      img.onload = () => setBgImage(bannerData.imageUrl);
      img.onerror = () => setBgImage("/assets/img/hero/hero-4/hero-4.jpg");
    }
  }, [bannerData]);

  if (loading) {
    return (
      <div
        style={{
          height: "600px",
          width: "100%",
          backgroundColor: "#e0e0e0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          flexDirection: "column",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            height: "20px",
            width: "200px",
            backgroundColor: "#d6d6d6",
            borderRadius: "6px",
            marginBottom: "20px",
            animation: "pulse 1.5s infinite",
          }}
        ></div>
        <div
          style={{
            height: "35px",
            width: "350px",
            backgroundColor: "#d6d6d6",
            borderRadius: "6px",
            animation: "pulse 1.5s infinite",
          }}
        ></div>

        <style>
          {`
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
            }
          `}
        </style>
      </div>
    );
  }

  return (
    <div
      className="tg-hero-area tg-hero-4-space fix p-relative include-bg"
      style={{
        backgroundImage: `url(${bgImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="tg-hero-4-content text-center">
              <h4 className="tg-hero-3-subtitle tg-hero-4-subtitle">
                {bannerData?.title || "Find Your Dream Hotel!"}
              </h4>
              <h2 className="tg-hero-3-title tg-hero-4-title">
                {bannerData?.subtitle || "Find Your Dream Hotel & Resort"}
              </h2>
            </div>
          </div>
        </div>
      </div>

      {/* Keep your SVG shapes */}
      <div className="tg-hero-bottom-shape d-none d-lg-block">
        <span>
          <svg
            width="432"
            height="298"
            viewBox="0 0 432 298"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="line-1"
              opacity="0.4"
              d="M39.6062 428.345C4.4143 355.065 -24.2999 203.867 142.379 185.309C350.726 162.111 488.895 393.541 289.171 313.515C129.391 249.494 458.204 85.4772 642.582 11.4713"
              stroke="white"
              strokeWidth="24"
            />
          </svg>
        </span>
      </div>
      <div className="tg-hero-bottom-shape-2 d-none d-lg-block">
        <span>
          <svg
            width="154"
            height="321"
            viewBox="0 0 154 321"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              className="line-1"
              opacity="0.4"
              d="M144.616 328.905C116.117 300.508 62.5986 230.961 76.5162 179.949C93.9132 116.184 275.231 7.44493 -65.0181 12.8762"
              stroke="white"
              strokeWidth="24"
            />
          </svg>
        </span>
      </div>
    </div>
  );
};

export default Banner;
