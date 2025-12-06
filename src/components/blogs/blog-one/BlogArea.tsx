import { Link } from "react-router-dom";
import { useEffect } from "react";
import ReactPaginate from "react-paginate";
import BlogSidebar from "../blog-sidebar";
import Button from "../../common/Button";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import { fetchBlogs, setCurrentPage, setSearch } from "../../../redux/features/blogSlice";

const BlogArea = () => {
  const dispatch = useAppDispatch();
  const { blogs, loading, error, currentPage, totalPages } = useAppSelector(
    (state) => state.blog
  );
  useEffect(() => {
    dispatch(fetchBlogs({ page: currentPage, limit: 8 }));
  }, [dispatch, currentPage]);

  const handlePageClick = (event: { selected: number }) => {
    const newPage = event.selected + 1;
    dispatch(setCurrentPage(newPage));
  };

  if (loading) {
    return (
      <div className="tg-blog-grid-area pt-130 pb-100">
        <div className="container">
          <div className="text-center">Loading blogs...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tg-blog-grid-area pt-130 pb-100">
        <div className="container">
          <div className="text-center text-danger">Error: {error}</div>
        </div>
      </div>
    );
  }

  // if (blogs.length === 0) {
  //   setTimeout(() => {
  //     dispatch(fetchBlogs({ page: 1, limit: 8 }));
  //   }, 2000);
  //   return (
  //     <div className="tg-blog-grid-area pt-130 pb-100">
  //       <div className="container text-center col-xl-9">
  //         <div className="row">
  //         <div
  //           className="spinner-border text-primary "
  //           role="status"
  //           style={{ width: "50px", height: "50px" }}
  //           ></div>
  //         <div className="text-center">
  //           No blogs available for this Query redirecting to All blogs
  //         </div>
  //           </div>
  //       </div>
  //     </div>
  //   );
  // }
  // console.log(resetSearch)

  return (
    <div className="tg-blog-grid-area pt-90 pb-100">
      <div className="container">
        <div className="row">
          {blogs.length === 0 ? (
            <div className=" col-xl-9 text-center">
              <div>No Blogs Available</div>
              <button className="tg-btn tg-btn-lg mt-4" onClick={() => {
                dispatch(setSearch(''))
                dispatch(fetchBlogs({ page: 1, limit: 8 }))
              }} >
                Load All Blogs
              </button>
            </div>
          ) : (
            <div className="col-xl-9 col-lg-8">
              <div className="tg-blog-grid-wrap tg-blog-lg-spacing mr-50">
                <div className="row">
                  {blogs.map((item) => (
                    <div key={item._id} className="col-xl-6 col-lg-12 col-md-6">
                      <div className="tg-blog-grid-item mb-30">
                        <div className="tg-blog-standard-thumb mb-15">
                          <Link to={`/blog-details/${item.slug}`}>
                            <img
                              className="w-100 h-100"
                              src={item.coverImage}
                              alt="blog"
                            />
                          </Link>
                        </div>
                        <div className="tg-blog-standard-content">
                          <h2 className="tg-blog-standard-title">
                            
                            <Link to={`/blog-details/${item.slug}`}>
                              {item.title.slice(0,20)}
                            </Link>
                          </h2>
                          <div className="tg-blog-standard-date mb-10">
                            <span>by {item.author}</span>
                            <span>
                              {new Date(item.publishDate).toLocaleDateString(
                                "en-Gb",
                                {
                                  day: "2-digit",
                                  month: "numeric",
                                  year: "2-digit",
                                }
                              )}
                            </span>
                            <span>{item.readingTime} min read</span>
                          </div>
                          <p className="mb-20 tg-blog-standard-para">
                            {item.excerpt}
                          </p>
                          <div className="tg-blog-sidebar-btn">
                            <Link
                              to={`/blog-details/${item.slug}`}
                              className="tg-btn tg-btn-switch-animation"
                            >
                              <Button text="Read More" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {totalPages > 1 && (
                  <div className="tg-pagenation-wrap text-center pt-80 mb-30">
                    <nav>
                      <ReactPaginate
                        breakLabel="..."
                        nextLabel={<i className="p-btn">Next Page</i>}
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        pageCount={totalPages}
                        previousLabel={<i className="p-btn">Previous Page</i>}
                        renderOnZeroPageCount={null}
                        forcePage={currentPage - 1}
                      />
                    </nav>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="col-xl-3 col-lg-4">
            <BlogSidebar

            // resetSearch={resetSearch} setResetSearch={setResetsearch}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogArea;
