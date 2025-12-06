import { Link } from "react-router-dom";
import { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { fetchBlogs } from "../../../redux/features/blogSlice";

const Blog = () => {
  const dispatch = useAppDispatch();
  const { blogs, loading, error } = useAppSelector((state) => state.blog);

  useEffect(() => {
    dispatch(fetchBlogs({ page: 1, limit: 3 })); // Only fetch 3 blogs for landing page
  }, [dispatch]);

  if (loading) {
    return (
      <div className="tg-blog-area pt-130 pb-110 include-bg p-relative z-index-1" style={{ backgroundImage: `url(/assets/img/blog/blog-4/blog.jpg)` }}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="text-white">Loading blogs...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tg-blog-area pt-130 pb-110 include-bg p-relative z-index-1" style={{ backgroundImage: `url(/assets/img/blog/blog-4/blog.jpg)` }}>
        <div className="container">
          <div className="row">
            <div className="col-12 text-center">
              <div className="text-white">Error loading blogs: {error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tg-blog-area pt-130 pb-110 include-bg p-relative z-index-1" style={{ backgroundImage: `url(/assets/img/blog/blog-4/blog.jpg)` }}>
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="tg-location-section-title text-center mb-30">
              <h5 className="tg-section-subtitle mb-15 wow fadeInUp" data-wow-delay=".3s" data-wow-duration=".9s">Blog And Article</h5>
              <h2 className="mb-15 text-capitalize wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">Latest News & Articles</h2>
              <p className="text-capitalize wow fadeInUp" data-wow-delay=".5s" data-wow-duration=".9s">Are you tired of the typical tourist destinations and looking<br />
                to step out of your comfort zone travel</p>
            </div>
          </div>
          
          {/* Map through blogs from Redux state */}
          {blogs.slice(0, 3).map((item) => (
            <div key={item._id} className="col-xl-4 col-lg-6 col-md-6 wow fadeInLeft" data-wow-delay=".4s" data-wow-duration=".9s">
              <div className="tg-blog-item tg-blog-2-item mb-25">
                <div className="tg-blog-thumb p-relative fix mb-25">
                  <Link to={`/blog-details/${item.slug}`}>
                    <img className="w-100" src={item.coverImage} onError={(e) => {
                        e.currentTarget.onerror = null; // prevent infinite loop
                        e.currentTarget.src =
                          "/assets/img/banner/thumb.jpg";
                      }}  alt="blog" />
                  </Link>
                
                </div>
                <div className="tg-blog-content p-relative">
                  <h3 className="tg-blog-title">
                    <Link to={`/blog-details/${item.slug}`}>{item.title}</Link>
                  </h3>
                  <div className="tg-blog-date mb-10">
                    <span className="mr-20">
                      <i className="fa-light fa-calendar"></i> {new Date(item.publishDate).toLocaleDateString("en-Gb",{
                                  day:'2-digit',
                                  month:'numeric',
                                  year:'2-digit'
                                })}
                    </span>
                    <span>
                      <i className="fa-regular fa-clock"></i> {item.readingTime} min read
                    </span>
                  </div>
                  <p className="tg-blog-text mb-0">{item.excerpt}</p>
                </div>
              </div>
            </div>
          ))}
          
          <div className="col-12 wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">
            <div className="tg-blog-bottom text-center pt-15">
              <p>Want to see our Recent News & Updates. <Link to="/blog-grid">Click here to View More</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Blog;