import SEO from "../components/SEO"
import Wrapper from "../layouts/Wrapper"
import BlogDetailsPage from "./Blog-Detailspage"

const BlogDetailsMain = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'Blog Details'} />
         <BlogDetailsPage />
      </Wrapper>
   )
}

export default BlogDetailsMain
