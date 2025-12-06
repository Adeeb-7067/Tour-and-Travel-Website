import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCompany } from "../../redux/features/companySlice";
import type { RootState, AppDispatch } from "../../redux/store";
import { Link } from "react-router-dom";
import ContactForm from "../forms/ContactForm";

const ContactArea = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.company);

  useEffect(() => {
    dispatch(fetchCompany());
  }, [dispatch]);

  if (loading) return <p>Loading company info...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div className="tg-contact-area pt-130 p-relative z-index-1 pb-100">
      <img className="tg-team-shape-2 d-none d-md-block" src="/assets/img/banner/banner-2/shape.png" alt="" />
      <div className="container">
        <div className="row align-items-center">
          <div className="col-lg-5">
            <div className="tg-team-details-contant tg-contact-info-wrap mb-30">
              <h6 className="mb-15">Information:</h6>
              <p className="mb-25">{data?.aboutUs || "Error fetching About Us"}</p>
              <div className="tg-team-details-contact-info mb-35">
                <div className="tg-team-details-contact">
                  <div className="item">
                    <span>Phone :</span>
                    <Link to={`tel:${data?.contactNumber || "+91-1234567890"}`}>
                      {data?.contactNumber || "+91-1234567890"}
                    </Link>
                  </div>
                  <div className="item">
                    <span>E-mail :</span>
                    <Link to={`mailto:${data?.supportEmail || "info@gmail.com"}`}>
                      {data?.supportEmail || "info@gmail.com"}
                    </Link>
                  </div>
                  <div className="item">
                    <span>Address :</span>
                    <Link to="#">{data?.address || "1426 California, USA"}</Link>
                  </div>
                </div>
              </div>
              <div className="tg-contact-map h-100">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d31078.361591144112!2d-74.0256365664179!3d40.705584751235754!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sbd!4v1724572184688!5m2!1sen!2sbd"
                  width="600"
                  height="450"
                  style={{ border: "0" }}
                  loading="lazy"
                ></iframe>
              </div>
            </div>
          </div>
          <div className="col-lg-7">
            <div className="tg-contact-content-wrap ml-40 mb-30">
              <h3 className="tg-contact-title mb-15">Let&apos;s connect and get to know each other</h3>
              <p className="mb-30">{data?.aboutUs || "Brendan Fraser, renowned actor..."}</p>
              <div className="tg-contact-form tg-tour-about-review-form">
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactArea;
