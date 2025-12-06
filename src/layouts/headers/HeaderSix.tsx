import NavMenu from "./Menu/NavMenu";
import { Link } from "react-router-dom";
import { useState } from "react";
import Offcanvas from "./Menu/Offcanvas";
import Sidebar from "./Menu/Sidebar";
import HeaderSearch from "./Menu/HeaderSearch";
import HeaderSixTop from "./Menu/HeaderSixTop";

import UseSticky from "../../hooks/UseSticky";
import logo from "../../../public/assets/img/logo.jpg";

const HeaderSix = () => {
  const { sticky } = UseSticky();
  const [offCanvas, setOffCanvas] = useState<boolean>(false);
  const [sidebar, setSidebar] = useState<boolean>(false);
  const [isSearch, setIsSearch] = useState<boolean>(false);

  return (
    <>
      <header className="tg-header-height" style={{
         zIndex:10
      }}>
        <div className="tg-header__area">
          <HeaderSixTop />
          <div
            className={`tg-header-4-bootom tg-header-lg-space ${
              sticky ? "header-sticky" : ""
            }`}
            id="header-sticky"
          >
            <div className="container">
              <div className="row align-items-center">
                <div className="col-lg-8 col-5"> 
                  <div
                    className="tgmenu__wrap d-flex align-items-center"
                    style={{
                      height: "70px",
                    }}
                  >
                    <div className=" d-flex gap-2">
                      <Link to="/">
                        <img
                          src={logo}
                          alt="Logo"
                          style={{
                            height: "50px",
                            width: "50px",
                            borderRadius: "50%",
                          }}
                        />
                      </Link>

                      <div
                        style={{
                          lineHeight: "1.2",
                          display: "flex",
                          flexDirection: "column",
                          marginTop: "04px",
                          padding: "2px",
                        }}
                      >
                        <span
                          style={{
                            fontSize: "22px",
                            fontWeight: "600",
                            letterSpacing: "0.5px",
                            color: "#111",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                          झुंजारराव
                        </span>

                        <span
                          style={{
                            fontSize: "13px",
                            fontWeight: "600",
                            letterSpacing: "2px",
                            textTransform: "uppercase",
                            textAlign: "left",
                            color: "#FF6B00",
                            fontFamily: "Poppins, sans-serif",
                          }}
                        >
                            यात्रा
                        </span>
                      </div>
                    </div>
                    <nav className="tgmenu__nav  ml-90 d-none d-xl-block">
                      <div className="tgmenu__navbar-wrap tgmenu__main-menu tgmenu__navbar-wrap-4 d-none d-xl-flex">
                        <NavMenu />
                      </div>
                    </nav>
                  </div>
                </div>
                <div className="col-lg-4 col-7">
                  <div className="tg-menu-right-action tg-menu-right-action-3 tg-menu-4-right-action d-flex align-items-center justify-content-end">
                    <Link to="/wishlist">
                      <button className="search-button ">
                        {/* <SearchIcon /> */}

                        <svg
                          width="20"
                          height="18"
                          viewBox="0 0 20 18"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M10.5167 16.3416C10.2334 16.4416 9.76675 16.4416 9.48341 16.3416C7.06675 15.5166 1.66675 12.075 1.66675 6.24165C1.66675 3.66665 3.74175 1.58331 6.30008 1.58331C7.81675 1.58331 9.15841 2.31665 10.0001 3.44998C10.8417 2.31665 12.1917 1.58331 13.7001 1.58331C16.2584 1.58331 18.3334 3.66665 18.3334 6.24165C18.3334 12.075 12.9334 15.5166 10.5167 16.3416Z"
                            stroke="currentColor"
                            strokeWidth="1.5"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </button>
                    </Link>
{/* 
                    <div className="tg-header-cart p-relative d-none d-xl-block">
                      <Link to="/cart">
                        <button className="cart-button">
                          <span>
                            <CartIconTwo />
                          </span>
                        </button>
                      </Link>
                      <HeaderCart />
                    </div> */}
                    {/* <div className="tg-header-menu-bar lh-1 p-relative ml-10">
                                 <button onClick={() => setSidebar(true)} className="tgmenu-offcanvas-open-btn menu-tigger d-none d-xl-block">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                 </button>
                                 <button onClick={() => setOffCanvas(true)} className="tgmenu-offcanvas-open-btn mobile-nav-toggler d-block d-xl-none">
                                    <span></span>
                                    <span></span>
                                    <span></span>
                                 </button>
                              </div> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Offcanvas offCanvas={offCanvas} setOffCanvas={setOffCanvas} />
      <Sidebar sidebar={sidebar} setSidebar={setSidebar} />
      <HeaderSearch isSearch={isSearch} setIsSearch={setIsSearch} />
    </>
  );
};

export default HeaderSix;
