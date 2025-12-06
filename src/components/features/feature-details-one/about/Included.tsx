import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../redux/store";
import { fetchPackageById } from "../../../../redux/features/placeDetailSlice";
import { useEffect } from "react";
import { useParams } from "react-router-dom";

const Included = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.placeDetail);

  const params = useParams();
  const packageId = params.id;

  useEffect(() => {
    if (!packageId) return;
    dispatch(fetchPackageById(packageId));
  }, [dispatch, packageId]);

  const inclusions = data?.inclusions || [];
  const exclusions = data?.exclusions || [];

  return (
    <div className="tg-tour-about-inner mb-40">
      <h4 className="tg-tour-about-title mb-20">Included / Excluded</h4>
      <div className="row">
        <div className="col-lg-5">
          <div className="tg-tour-about-list tg-tour-about-list-2">
            <ul>
              {inclusions.length > 0 ? (
                inclusions.map((item: string, i: number) => (
                  <li key={i}>
                    <span className="icon mr-10">
                      <i className="fa-sharp fa-solid fa-check fa-fw"></i>
                    </span>
                    <span className="text">{item}</span>
                  </li>
                ))
              ) : (
                <li>No inclusions listed.</li>
              )}
            </ul>
          </div>
        </div>

        <div className="col-lg-7">
          <div className="tg-tour-about-list tg-tour-about-list-2 disable">
            <ul>
              {exclusions.length > 0 ? (
                exclusions.map((item: string, i: number) => (
                  <li key={i}>
                    <span className="icon mr-10">
                      <i className="fa-sharp fa-solid fa-xmark"></i>
                    </span>
                    <span className="text">{item}</span>
                  </li>
                ))
              ) : (
                <li>No exclusions listed.</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Included;
