import LoginForm from "../../forms/LoginForm"

const LoginArea = () => {
   return (
      <div className="tg-login-area pt-20 " style={{
         backgroundImage: `url(https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D)`,
         backgroundRepeat: "no-repeat",
         backgroundPosition: "center",
         backgroundSize: "cover",
         minHeight: "100vh",
      }}>
         <div className="container">
            <div className="row justify-content-center ">
               <div className="col-xl-6 col-lg-8 col-md-10 ">
                  <div className="tg-login-wrapper bg-white rounded bg-opacity-95 ">
                     <div className="tg-login-top text-center mb-30">
                        <h2>Sign in to your account</h2>
                        <p>Enter your credentials to acces your account.</p>
                     </div>
                     <div className="tg-login-form">
                        <div className="tg-tour-about-review-form">
                           <LoginForm />
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   )
}

export default LoginArea
