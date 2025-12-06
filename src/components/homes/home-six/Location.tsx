import { Link } from "react-router-dom";
import location_data from "../../../data/LocationData";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { useEffect, useMemo } from "react";
import { fetchHomeData } from "../../../redux/features/homeSlice";

const Location = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector(
    (state: RootState) => state.home
  );

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  const popularCountries = useMemo(() => {
    const apiItem = data?.find((item: any) => item._id === "popularCountries");
    return apiItem?.banners || [];
  }, [data]);

  const finalData =
    !loading && !error && popularCountries.length > 0
      ? popularCountries.map((item: any) => ({
          id: item._id,
          title: item.countryName,
          thumb: item.image,
          total: "Explore",
        }))
      : location_data.filter((items) => items.page === "home_6");

  return (
    <div className="tg-location-area p-relative pb-60 pt-140">
      <img
        className="tg-location-shape tg-location-4-shape d-none d-lg-block"
        src="/assets/img/location/shape-2.png"
        alt="shape"
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
                Next Adventure Destination
              </h5>
              <h2
                className="mb-15 text-capitalize wow fadeInUp"
                data-wow-delay=".5s"
                data-wow-duration=".9s"
              >
                Popular Travel Destinations <br /> Available Worldwide
              </h2>
            </div>
          </div>
          <div className="col-lg-3">
            {/* <div
              className="tg-location-3-btn text-end wow fadeInUp mb-40"
              data-wow-delay=".6s"
              data-wow-duration=".9s"
            >
              <Link
                to="/map-listing"
                className="tg-btn tg-btn-gray tg-btn-switch-animation"
              >
                <Button text="All Locations" />
              </Link>
            </div> */}
          </div>
        </div>

        <div className="row">
          {finalData.slice(0, 4).map((item: any, index: number) => (
            <div
              key={item.id || index}
              className="col-lg-3 col-md-6 col-sm-6 wow fadeInUp"
              data-wow-delay=".3s"
              data-wow-duration=".9s"
            >
              <div className="bg-white tg-round-25 p-relative z-index-1">
                <div className="tg-location-wrap p-relative mb-30">
                  <div className="tg-location-thumb">
                    <img
                      className="w-100"
                      style={{
                        height: "200px",
                      }}
                      src={item.thumb}
                      alt={item.title}
                      onError={(e) => {
                        e.currentTarget.onerror = null; // prevent infinite loop
                        e.currentTarget.src =
                          "./../../../../public/assets/img/location/location-3.jpg";
                      }}
                    />
                  </div>
                  <div className="tg-location-content text-center">
                    <span className="tg-location-time">{index + 1}</span>
                    <h3 className="tg-location-title mb-0">
                      <Link to="/map-listing">{item.title}</Link>
                    </h3>
                  </div>
                  <div className="tg-location-border one"></div>
                  <div className="tg-location-border two"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Location;
