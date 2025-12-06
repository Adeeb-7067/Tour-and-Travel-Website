// import Breadcrumb from "./Breadcrumb"
import FeatureDetailsArea from "./FeatureDetailsArea"
import FeatureAboutArea from "./FeatureAboutArea"
// import HeaderThree from "../../../layouts/headers/HeaderThree"
import FooterSix from "../../../layouts/footers/FooterSix"
import HeaderSix from "../../../layouts/headers/HeaderSix"

const FeatureDetailsOne = () => {
   
   return (
      <>
         {/* <HeaderThree /> */}
         <HeaderSix/>
         <main>
            {/* <Breadcrumb /> */}
            <FeatureDetailsArea />
            <FeatureAboutArea />
         </main>
         <FooterSix />
      </>
   )
}

export default FeatureDetailsOne
