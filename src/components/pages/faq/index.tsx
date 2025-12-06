import FaqArea from "./FaqArea"
import Cta from "../pricing/Cta"
// import HeaderThree from "../../../layouts/headers/HeaderThree"
import BreadCrumb from "../../common/BreadCrumb"
import HeaderSix from "../../../layouts/headers/HeaderSix"
import FooterSix from "../../../layouts/footers/FooterSix"

const Faq = () => {
   return (
      <>
         <HeaderSix />
         <main>
            <BreadCrumb title="Frequently Asked Question" sub_title="Faq’s" />
            <FaqArea />
            <Cta />
         </main>
         <FooterSix />
      </>
   )
}

export default Faq
