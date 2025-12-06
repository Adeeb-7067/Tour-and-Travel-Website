import RegisterForm from "../../forms/RegisterForm";
import RegisterFormAgent from "../../forms/RegisterFormAgent";

const RegisterArea = () => {
  const userType = localStorage.getItem("UserType");
  return (
    <div
      className="tg-login-area pt-20"
      style={{
        backgroundImage: `url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        backgroundSize: "cover",
        minHeight: "100vh",
      }}
    >
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8 col-md-10">
            <div
              className="tg-login-wrapper bg-white rounded "
              style={{
                paddingTop: "30px",
                height: "90%",
              }}
            >
              <div className="tg-login-top text-center mb-30">
                <h2>Register Now!</h2>
                <p>You can signup with you social account below</p>
              </div>
              <div className="tg-login-form">
                <div className="tg-tour-about-review-form">
                  {userType !== "Agent" ? <RegisterForm /> : <RegisterFormAgent />}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterArea;
