// import BookingForm from "./BookingForm";
import Banner from "./Banner";
import Ads from "./Ads";
import Listing from "./Listing";
import CtaThree from "./Cta";
import Choose from "./Choose";
import Cta from "./CtaTwo";
import Location from "./Location";
import CtaTwo from "./CtaThree";
import Counter from "./Counter";
import Testimonial from "../home-seven/Testimonial";
import Blog from "./Blog";
import Brand from "../home-seven/Brand";
import HeaderSix from "../../../layouts/headers/HeaderSix";
import FooterSix from "../../../layouts/footers/FooterSix";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { useEffect, useState } from "react";
import { fetchHomeData } from "../../../redux/features/homeSlice";

const HomeSix = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { error } = useSelector((state: RootState) => state.home);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      await dispatch(fetchHomeData()).unwrap();
      setErrorMessage(null);
    } catch (err: any) {
      console.error("Error loading home data:", err);
      setErrorMessage("Unable to fetch home data. Showing fallback content.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f7f7f7",
          color: "#333",
          textAlign: "center",
        }}
      >
        <div
          className="spinner-border text-primary"
          role="status"
          style={{ width: "50px", height: "50px" }}
        ></div>
        <h3 style={{ marginTop: "20px" }}>Loading your travel experience...</h3>
        <p style={{ fontSize: "14px", color: "#777" }}>
          Please wait while we prepare amazing destinations for you.
        </p>
      </div>
    );
  }

  return (
    <>
      <HeaderSix />

      {(error || errorMessage) && (
        <div
          style={{
            backgroundColor: "#fff3cd",
            border: "1px solid #ffeeba",
            color: "#856404",
            textAlign: "center",
            padding: "10px 15px",
            fontSize: "14px",
          }}
        >
          {errorMessage || "Some sections are showing fallback content due to network issues."}
        </div>
      )}

      <main>
        {/* <BookingForm /> */}
        <Banner />
        <Ads />
        <Listing />
        <Choose />
        <Cta />
        <Location />
        <CtaTwo />
        <Counter />
        <CtaThree />
        <Testimonial />
        <Brand />
        <Blog />
      </main>

      <FooterSix />
    </>
  );
};

export default HomeSix;
