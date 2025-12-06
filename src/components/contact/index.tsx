// import FooterFive from "../../layouts/footers/FooterFive"
import FooterSix from "../../layouts/footers/FooterSix"
import HeaderSix from "../../layouts/headers/HeaderSix"
// import HeaderThree from "../../layouts/headers/HeaderThree"
import BreadCrumb from "../common/BreadCrumb"
import ContactArea from "./ContactArea"

const Contact = () => {
   return (
      <>
         {/* <HeaderThree /> */}
         <HeaderSix/>
         <main>
            <BreadCrumb title="Contact With Us" sub_title="Contact" />
            <ContactArea />
         </main>
         <FooterSix />
      </>
   )
}

export default Contact
