import React, { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import BreadCrumb from "../components/common/BreadCrumb";
import HeaderSix from "../layouts/headers/HeaderSix";
import FooterSix from "../layouts/footers/FooterSix";
import type { RootState } from "../redux/store";
import { fetchBlogBySlug, fetchBlogs } from "../redux/features/blogSlice";
import BlogSidebar from "../components/blogs/blog-sidebar";

const AuthorBio = ({ author }: { author: string }) => {
  const firstLetter = author.charAt(0).toUpperCase();

  return (
    <div style={{ marginBottom: "40px" }}>
      <div>
        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
          <li>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
              }}
              className="flex-sm-row"
            >
              <div
                style={{
                  width: "100px",
                  height: "60px",
                  fontSize: "24px",
                  fontWeight: "bold",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  borderRadius: "50%",
                  backgroundColor: "#0d6efd",
                  color: "white",
                }}
              >
                {firstLetter}
              </div>
              <div
                style={{ marginLeft: "0", marginTop: "12px" }}
                className="ms-sm-3 mt-sm-0"
              >
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    marginBottom: "10px",
                  }}
                >
                  <h6 style={{ margin: 0, fontWeight: "600" }}>{author}</h6>
                  <span style={{ color: "#6c757d", fontSize: "14px" }}>
                    Travel Writer
                  </span>
                </div>
                <p style={{ marginBottom: 0, lineHeight: "1.6" }}>
                  {author} is an experienced travel writer and adventure
                  enthusiast with a passion for exploring hidden gems and
                  sharing authentic travel experiences with readers worldwide.
                </p>
              </div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  );
};

const GallerySection = ({ images }: { images: string[] }) => {
  if (!images || images.length === 0) return null;

  return (
    <div style={{ marginBottom: "40px" }}>
      <h4 style={{ marginBottom: "30px", fontWeight: "600" }}>Photo Gallery</h4>
      <div className="row">
        {images.map((image, index) => (
          <div key={index} className="col-md-6 mb-3">
            <div style={{ overflow: "hidden", borderRadius: "12px" }}>
              <img
                src={image}
                alt={`Gallery ${index + 1}`}
                style={{
                  width: "100%",
                  transition: "transform 0.4s ease",
                  height: "200px",
                  objectFit: "cover",
                }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// const CommentSection = () => {
//   const { currentBlog } = useSelector((state: RootState) => state.blog);

//   if (!currentBlog) return null;

//   return (
//     <div style={{ marginBottom: '40px' }}>
//       <div>
//         <h4 style={{ marginBottom: '30px', fontWeight: '600' }}>Comments</h4>
//         <div style={{ textAlign: 'center', color: '#6c757d' }}>
//           <p style={{ margin: 0 }}>No comments yet. Be the first to comment!</p>
//         </div>
//       </div>
//     </div>
//   );
// };

const BlogDetailsPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const dispatch = useDispatch();
  const { currentBlog, loading, error } = useSelector(
    (state: RootState) => state.blog
  );

  useEffect(() => {
    if (slug) {
      dispatch(fetchBlogBySlug(slug) as any);
      dispatch(fetchBlogs({ page: 1, limit: 20 }) as any);
    }
  }, [dispatch, slug]);

  if (loading) {
    return (
      <>
        <HeaderSix />
        <main>
          <BreadCrumb title="Loading..." sub_title="Blog Details" />
          <section style={{ padding: "120px 0" }}>
            <div className="container">
              <div className="row">
                <div className="col-12 text-center">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                  <p style={{ marginTop: "12px" }}>Loading blog post...</p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <FooterSix />
      </>
    );
  }

  if (error) {
    return (
      <>
        <HeaderSix />
        <main>
          <BreadCrumb title="Error" sub_title="Blog Details" />
          <section style={{ padding: "120px 0" }}>
            <div className="container">
              <div className="row">
                <div className="col-12 text-center">
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                  <button
                    className="btn btn-primary"
                    onClick={() =>
                      slug && dispatch(fetchBlogBySlug(slug) as any)
                    }
                  >
                    <span>Try Again</span>
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
        <FooterSix />
      </>
    );
  }

  if (!currentBlog) {
    return (
      <>
        <HeaderSix />
        <main>
          <BreadCrumb title="Not Found" sub_title="Blog Details" />
          <section style={{ padding: "120px 0" }}>
            <div className="container">
              <div className="row">
                <div className="col-12 text-center">
                  <h3>Blog post not found</h3>
                  <p>The blog post you're looking for doesn't exist.</p>
                </div>
              </div>
            </div>
          </section>
        </main>
        <FooterSix />
      </>
    );
  }

  const formattedDate = new Date(currentBlog.publishDate).toLocaleDateString("en-Gb",{
                                  day:'2-digit',
                                  month:'numeric',
                                  year:'2-digit'
                                })

  return (
    <>
      <HeaderSix />
      <main>
        <BreadCrumb title={currentBlog.title} sub_title="Blog Details" />
        <section style={{ padding: "120px 0" }}>
          <div className="container">
            <div className="row">
              {/* Main Content */}
              <div className="col-xl-9 col-lg-8 order-1 order-lg-1 mb-4 mb-lg-0">
                <div style={{ width: "90%" }}>
                  <article style={{ marginBottom: "50px" }}>
                    {/* Featured Badge */}
                    {currentBlog.isFeatured && (
                      <div style={{ marginBottom: "12px" }}>
                        <span className="badge bg-warning text-dark px-3 py-2">
                          <i className="fas fa-star me-2"></i> Featured Post
                        </span>
                      </div>
                    )}

                    {/* Cover Image */}
                    <div
                      style={{
                        marginBottom: "30px",
                        overflow: "hidden",
                        borderRadius: "12px",
                      }}
                    >
                      <img
                        src={currentBlog.coverImage}
                        alt={currentBlog.title}
                        style={{
                          width: "100%",
                          padding: "10",
                          transition: "transform 0.4s ease",
                          objectFit: "cover",
                          height: "400px",
                        }}
                      />
                    </div>

                    {/* Blog Header */}
                    <div>
                      <div
                        style={{
                          marginBottom: "12px",
                          color: "#6c757d",
                          display: "flex",
                          flexWrap: "wrap",
                          gap: "16px",
                        }}
                      >
                        <span>
                          <i
                            className="far fa-user me-1"
                            style={{ color: "#0d6efd" }}
                          ></i>
                          <strong>{currentBlog.author}</strong>
                        </span>
                        <span>
                          <i
                            className="far fa-calendar-alt me-1"
                            style={{ color: "#0d6efd" }}
                          ></i>
                          {formattedDate}
                        </span>
                        <span>
                          <i
                            className="far fa-clock me-1"
                            style={{ color: "#0d6efd" }}
                          ></i>
                          {currentBlog.readingTime} min read
                        </span>
                      </div>

                      <h1
                        style={{
                          marginBottom: "24px",
                          fontWeight: "700",
                          fontSize: "2.5rem",
                          lineHeight: "1.2",
                        }}
                      >
                        {currentBlog.title}
                      </h1>

                      <div style={{ marginBottom: "24px" }}>
                        <p
                          style={{
                            fontSize: "1.25rem",
                            fontWeight: "300",
                            fontStyle: "italic",
                            color: "#6c757d",
                            borderLeft: "3px solid #0d6efd",
                            paddingLeft: "12px",
                            paddingTop: "8px",
                            paddingBottom: "8px",
                            lineHeight: "1.5",
                          }}
                        >
                          {currentBlog.excerpt}
                        </p>
                      </div>

                      {/* Blog Content */}
                      <div style={{ marginBottom: "24px" }}>
                        {currentBlog.content && (
                          <div
                            dangerouslySetInnerHTML={{
                              __html: currentBlog.content,
                            }}
                            style={{
                              lineHeight: "1.7",
                              fontSize: "1.1rem",
                              wordWrap: "break-word",
                            }}
                          />
                        )}
                      </div>

                      {/* Gallery Section */}
                      {currentBlog.galleryImages &&
                        currentBlog.galleryImages.length > 0 && (
                          <GallerySection images={currentBlog.galleryImages} />
                        )}

                      {/* Tags and Social Sharing */}
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          flexWrap: "wrap",
                          borderTop: "1px solid #dee2e6",
                          paddingTop: "24px",
                          marginTop: "48px",
                        }}
                      >
                        <div style={{ marginBottom: "12px" }}>
                          <span
                            style={{ fontWeight: "600", marginRight: "8px" }}
                          >
                            Tags:
                          </span>
                          <ul
                            style={{
                              display: "inline-flex",
                              listStyle: "none",
                              padding: 0,
                              margin: 0,
                              flexWrap: "wrap",
                            }}
                          >
                            {currentBlog.tags?.map((tag) => (
                              <li
                                key={tag}
                                style={{
                                  marginRight: "8px",
                                  marginBottom: "8px",
                                  display: "inline-block",
                                  backgroundColor: "#f4edff",
                                  color: "#6a0dad",
                                  padding: "8px 16px",
                                  borderRadius: "10px",
                                  fontWeight: 500,
                                  fontSize: "16px",
                                  textAlign: "center",
                                }}
                              >
                                {tag}
                              </li>
                            ))}
                          </ul>
                        </div>
                        <div style={{ display: "flex", alignItems: "center" }}>
                          <span
                            style={{ fontWeight: "600", marginRight: "12px" }}
                          >
                            Share:
                          </span>
                          <a
                            href="#"
                            className="btn btn-outline-primary btn-sm me-2"
                          >
                            <i className="fab fa-facebook-f"></i>
                          </a>
                          <a
                            href="#"
                            className="btn btn-outline-info btn-sm me-2"
                          >
                            <i className="fab fa-twitter"></i>
                          </a>
                          <a
                            href="#"
                            className="btn btn-outline-primary btn-sm me-2"
                          >
                            <i className="fab fa-linkedin-in"></i>
                          </a>
                          <a
                            href="#"
                            className="btn btn-outline-success btn-sm"
                          >
                            <i className="fab fa-whatsapp"></i>
                          </a>
                        </div>
                      </div>
                    </div>
                  </article>

                  {/* Author Bio */}
                  <AuthorBio author={currentBlog.author} />

                  {/* Comments Section */}
                  {/* <CommentSection /> */}
                </div>
              </div>

              {/* Sidebar */}
              <div
                className="col-xl-3 col-lg-4 order-2 order-lg-2"
                style={{
                  marginTop: "40px",
                }}
              >
                <div>
                  <BlogSidebar showSearch={false} />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <FooterSix />
    </>
  );
};

export default BlogDetailsPage;
