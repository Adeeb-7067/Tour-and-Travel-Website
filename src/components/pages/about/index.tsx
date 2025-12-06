
import FooterSix from "../../../layouts/footers/FooterSix"
import HeaderSix from "../../../layouts/headers/HeaderSix"
// import HeaderThree from "../../../layouts/headers/HeaderThree"
import BreadCrumb from "../../common/BreadCrumb"
import AboutArea from "./AboutArea"
import Choose from "./Choose"
import Cta from "./Cta"
import { useDispatch } from "react-redux"
import type { AppDispatch } from "../../../redux/store"
import { useEffect } from "react"
import { fetchAbout } from "../../../redux/features/aboutSlice"

const About = () => {
  
// const { data, loading, error } = useSelector((state:RootState) => state.about);
const dispatch = useDispatch<AppDispatch>();


useEffect(() => {
  dispatch(fetchAbout());
}, [dispatch]);

   return (
      <>
         {/* <HeaderThree /> */}
         <HeaderSix/>
         <main>
            <BreadCrumb title="About Us" sub_title="About Us" />
            <AboutArea/>
            <Choose />
            <Cta />
         </main>
         <FooterSix />
      </>
   )
}

export default About
