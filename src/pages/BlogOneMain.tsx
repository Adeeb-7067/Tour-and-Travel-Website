import BlogOne from '../components/blogs/blog-one'
import SEO from '../components/SEO'
import Wrapper from '../layouts/Wrapper'

const BlogOneMain = () => {
   return (
      <Wrapper>
         <SEO pageTitle={'Blog'} />
         <BlogOne />
      </Wrapper>
   )
}

export default BlogOneMain
