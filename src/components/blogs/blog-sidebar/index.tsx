import {  useMemo, useState } from "react";
import Ads from "./Ads";
import Category from "./Category";
import RecentPost from "./RecentPost";
import Tags from "./Tags";
import { useAppSelector, useAppDispatch } from "../../../hooks/redux";
import { fetchBlogs, setSearch, setCurrentPage } from "../../../redux/features/blogSlice";

const BlogSidebar = ({ showSearch = true }: { showSearch?: boolean }) => {
  const dispatch = useAppDispatch();
  const { blogs, searchQuery } = useAppSelector((state) => state.blog);

  const [query, setQuery] = useState(() => searchQuery || "");


//  useEffect(()=>{
//   if(query!== ""){
//     setResetSearch('')
//     setQuery("")
//   }else{
//     setResetSearch(query)
//   }
//  },[resetSearch])
//  console.log(resetSearch,"child")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(setSearch(query));
    dispatch(setCurrentPage(1));
    dispatch(fetchBlogs({ page: 1, limit: 8, q: query }));
    setQuery('')
    
  };

  const sidebarData = useMemo(() => {
    const recentPosts = [...blogs]
      .sort((a, b) => new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime())
      .slice(0, 4)
      .map((blog) => ({
        id: blog._id,
        img: blog.coverImage,
        title: blog.title,
        slug: blog.slug,
        date: new Date(blog.publishDate).toLocaleDateString("en-Gb", {
          day: '2-digit',
          month: 'numeric',
          year: '2-digit'
        })
      }));

    const allTags = [...new Set(blogs.flatMap((blog) => blog.tags || []))];

    return { recentPosts, tags: allTags };
  }, [blogs]);

  return (
    <div className="tg-blog-sidebar top-sticky mb-30">
      {showSearch && (
        <div className="tg-blog-sidebar-search tg-blog-sidebar-box mb-40">
          <h5 className="tg-blog-sidebar-title mb-15">Search</h5>
          <div className="tg-blog-sidebar-form">
            <form onSubmit={handleSearch}>
              <input
                type="search"
                placeholder="Type here . . ."
                value={query}
                onChange={(e) => {setQuery(e.target.value)}}
              />
              <button type="submit">
                <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <g clipPath="url(#clip0_497_1336)">
                    <path
                      d="M17 17L13.5247 13.5247M15.681 8.3405C15.681 12.3945 12.3945 15.681 8.3405 15.681C4.28645 15.681 1 12.3945 1 8.3405C1 4.28645 4.28645 1 8.3405 1C12.3945 1 15.681 4.28645 15.681 8.3405Z"
                      stroke="#560CE3"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </g>
                  <defs>
                    <clipPath id="clip0_497_1336">
                      <rect width="18" height="18" fill="white" />
                    </clipPath>
                  </defs>
                </svg>
              </button>
            </form>
          </div>
        </div>
      )}

      <Category />
      <RecentPost posts={sidebarData.recentPosts} />
      <Ads />
      <Tags tags={sidebarData.tags} />
    </div>
  );
};

export default BlogSidebar;
