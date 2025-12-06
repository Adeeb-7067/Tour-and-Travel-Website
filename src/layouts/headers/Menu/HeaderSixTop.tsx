import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import type { AppDispatch, RootState } from "../../../redux/store";
import { useEffect } from "react";
import { fetchCompany } from "../../../redux/features/companySlice";

const HeaderSixTop = () => {
const dispatch = useDispatch<AppDispatch>()
const {data}= useSelector((state:RootState)=>state.company)

useEffect(()=>{
dispatch(fetchCompany());
},[dispatch])

  return (
    <div className="tg-header-top tg-header-top-space tg-primary-bg d-none d-lg-block">
      <div className="container">
        <div className="row">
          <div className="col-lg-6">
            <div className="tg-header-top-info d-flex align-items-center">
              <Link to="https://www.google.com/maps/@41.6758525,-86.2531698,18.17z">
                <i className="mr-5 fa-regular fa-location-dot"></i> 
                {data?.address || 'Tower second  floor indrapuri bhopal'}
              </Link>
              <span className="tg-header-dvdr mr-10 ml-10"></span>
              <Link to="mailto:info@Tourex.com">
                <i className="mr-5 fa-regular fa-envelope"></i> {data?.supportEmail || 'yatra@yatra.com'}
              </Link>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="tg-header-top-info d-flex align-items-center justify-content-end">
          
              {localStorage.getItem("token") ? (
                <Link to="/profile">
                  <i className="fa-regular fa-user"></i> Profile
                </Link>
              ) : (
                <Link to="/login">
                  <i className="fa-regular fa-user"></i> Login
                </Link>
              )}
              <span className="tg-header-dvdr mr-10 ml-10"></span>
                  <Link to="tel:+123595966">
                <i className="fa-sharp fa-regular fa-phone"></i> 
                {""} {data?.contactNumber || '+1234567890'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderSixTop;
