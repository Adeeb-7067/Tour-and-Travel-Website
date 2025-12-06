import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../redux/store";
import { fetchPackageById } from "../../../../redux/features/placeDetailSlice";
import { useEffect } from 'react';
import { useParams } from "react-router-dom";

// Default features fallback
const defaultFeatures = [
  "Tour the city with a licensed NYC tour guide",
  "Explore with a guide to delve deeper into the history",
  "Great for history buffs and travelers with limited time",
];

const AboutText = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.placeDetail);
  const params = useParams();
  const packageId = params.id;

  useEffect(() => {
    if (!packageId) return;
    dispatch(fetchPackageById(packageId));
  }, [dispatch, packageId]);

  // Get highlights with fallback
  const getHighlights = () => {
    if (data?.highlights && Array.isArray(data.highlights) && data.highlights.length > 0) {
      return data.highlights;
    }
    return defaultFeatures;
  };

  const highlights = getHighlights();

  return (
    <>
      <div className="tg-tour-about-inner mb-25">
        <h4 className="tg-tour-about-title mb-15">About This Tour</h4>
        <p className="text-capitalize lh-28">
          {data?.metaDescription || "Discover an amazing tour experience with expert guides and unforgettable sights."}
        </p>
      </div>
      
      <div className="tg-tour-about-inner mb-40">
        <h4 className="tg-tour-about-title mb-20">Trip Highlights</h4>
        <div className="tg-tour-about-list">
          <ul>
            {highlights.map((text, index) => (
              <li key={index}>
                <span className="icon mr-10">
                  <i className="fa-sharp fa-solid fa-check fa-fw"></i>
                </span>
                <span className="text">{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </>
  );
};

export default AboutText;