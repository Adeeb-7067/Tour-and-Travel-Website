/* eslint-disable @typescript-eslint/no-explicit-any */
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Controller } from "swiper/modules";
import { useEffect, useMemo, useState, type JSX } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { fetchHomeData } from "../../../redux/features/homeSlice";



interface ApiTestimonial {
  _id: string;
  avgRating: number;
  review: string;
  user?: {
    firstName?: string;
    avatarUrl?: string;
    designation?: string;
  };
}

interface FallbackTestimonial {
  id: number;
  name: string;
  designation: string;
  avgRating: string[];
  
  desc: JSX.Element;
  avatar: string;
}

const fallbackTestimonials: FallbackTestimonial[] = [
  {
    id: 1,
    name: "Mr. Robey Alexa",
    designation: "CEO, Logistra Agency",
    avgRating: Array(5).fill("fa-sharp fa-solid fa-star"),
    desc: (
      <>
        “ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam sed
        elit vel felis elementum suscipit. ”
      </>
    ),
    avatar: "/assets/img/testimonial/tes-4/tes-1.png",
  },
  {
    id: 2,
    name: "Jamie L. Jorgensen",
    designation: "Founder, Travel Co.",
    avgRating: Array(5).fill("fa-sharp fa-solid fa-star"),
    desc: (
      <>
        “ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur
        elementum convallis purus. ”
      </>
    ),
    avatar: "/assets/img/testimonial/tes-4/tes-2.png",
  },
  {
    id: 3,
    name: "Jason Whitmore",
    designation: "Founder",
    avgRating: Array(5).fill("fa-sharp fa-solid fa-star"),
    desc: (
      <>
        “ Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus in
        libero eget nulla fermentum feugiat. ”
      </>
    ),
    avatar: "/assets/img/testimonial/tes-4/tes-3.png",
  },
];

// Fixed Swiper settings with proper configuration
const settingThumbs = {
  slidesPerView: 4,
  loop: true,
  spaceBetween: 10,
  navigation: {
    nextEl: ".tg-testimonial-4-slide-next",
    prevEl: ".tg-testimonial-4-slide-prev",
  },
  modules: [Navigation, Controller],
};

const settingContent = {
  slidesPerView: 1,
  loop: true,
  spaceBetween: 30,
  navigation: {
    nextEl: ".tg-testimonial-4-slide-next",
    prevEl: ".tg-testimonial-4-slide-prev",
  },
  modules: [Navigation, Controller],
};

const Testimonial = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data, loading, error } = useSelector((state: RootState) => state.home);

  const [thumbSwiper, setThumbSwiper] = useState<any>(null);
  const [contentSwiper, setContentSwiper] = useState<any>(null);

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);

  const apiTestimonials: ApiTestimonial[] = useMemo(() => {
    const section = data?.find((item: any) => item._id === "TESTIMONIALS");
    return section?.banners || [];
  }, [data]);

  // Function to generate dynamic rating stars based on avgRating
  const generateRatingStars = (avgRating: number): string[] => {
    const rating = Math.min(Math.max(avgRating, 0), 5); // Ensure rating is between 0-5
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    
    return Array(5).fill("").map((_, index) => {
      if (index < fullStars) {
        return "fa-sharp fa-solid fa-star"; 
      } else if (index === fullStars && hasHalfStar) {
        return "fa-sharp fa-solid fa-star-half-alt"; 
      } else {
        return "fa-sharp fa-regular fa-star"; 
      }
    });
  };

  const finalTestimonials = useMemo(() => {
    if (!loading && !error && apiTestimonials.length > 0) {
      return apiTestimonials.map((item) => ({
        id: item._id,
        name: item.user?.firstName || "Anonymous User",
        designation: item.user?.designation || "Customer",
        avgRating: generateRatingStars(item.avgRating),
        desc: <>{item.review || "No review provided."}</>,
        avatar: item.user?.avatarUrl || "/assets/img/testimonial/default-avatar.png",
      }));
    }
    return fallbackTestimonials;
  }, [loading, error, apiTestimonials]);

  return (
    <div className="tg-testimonial-area pt-125 pb-50">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-10">
            <div className="tg-testimonial-4-wrap">
              <div className="row justify-content-center">
                <div className="tg-testimonial-qoute-wrap text-center mb-25">
                  <span>
                    <svg
                      width="60"
                      height="44"
                      viewBox="0 0 60 44"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M4.28571 44H17.1429L25.7143 26.4V0H0V26.4H12.8571L4.28571 44ZM38.5714 44H51.4286L60 26.4V0H34.2857V26.4H47.1429L38.5714 44Z"
                        fill="#E8E8E8"
                      />
                    </svg>
                  </span>
                </div>

                <div className="col-lg-4 col-md-6 col-sm-6 col-10">
                  <Swiper
                    {...settingThumbs}
                    onSwiper={setThumbSwiper}
                    controller={contentSwiper ? { control: contentSwiper } : undefined}
                    className="swiper-container tg-testimonial-4-thumb-active mb-25 fix p-relative"
                  >
                    {finalTestimonials.map((t, i) => (
                      <SwiperSlide key={t.id || i}>
                        <div className="tg-testimonial-4-slider-thumb">
                          {t.avatar ? (
                            <img
                              src={t.avatar}
                              alt={t.name}
                              onError={(e) => {
                                e.currentTarget.style.display = "none";
                                const parent = e.currentTarget.parentElement;
                                if (parent && !parent.querySelector(".fallback-avatar")) {
                                  const span = document.createElement("span");
                                  span.className = "fallback-avatar";
                                  span.textContent = t.name?.[0]?.toUpperCase() || "?";
                                  parent.appendChild(span);
                                }
                              }}
                            />
                          ) : (
                            <span className="fallback-avatar">
                              {t.name?.[0]?.toUpperCase() || "?"}
                            </span>
                          )}
                        </div>
                      </SwiperSlide>
                    ))}
                  </Swiper>
                </div>
              </div>

              <Swiper
                {...settingContent}
                onSwiper={setContentSwiper}
                 controller={thumbSwiper ? { control: thumbSwiper } : undefined}
                className="swiper-container tg-testimonial-4-slide-active p-relative fix pb-20"
              >
                {finalTestimonials.map((item) => (
                  <SwiperSlide key={item.id}>
                    <div className="tg-testimonial-4-content-wrap">
                      <div className="tg-testimonial-4-clients text-center">
                        <h5 className="tg-testimonial-4-name mb-0">
                          {item.name}
                        </h5>
                       
                        <div className="tg-testimonial-4-ratings mb-20">
                          {item.avgRating.map((cls, i) => (
                            <i key={i} className={cls}  ></i>
                          ))}
                        </div>
                        <p>{item.desc}</p>
                      </div>
                    </div>
                  </SwiperSlide>
                ))}

                <div className="tg-testimonial-4-slider-navigation">
                  <button className="tg-testimonial-4-slide-next">
                    <i className="fa-solid fa-arrow-right-long"></i>
                  </button>
                  <button className="tg-testimonial-4-slide-prev">
                    <i className="fa-solid fa-arrow-left-long"></i>
                  </button>
                </div>
              </Swiper>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Testimonial;