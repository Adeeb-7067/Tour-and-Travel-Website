import FooterSix from "../../../../layouts/footers/FooterSix"
import HeaderSix from "../../../../layouts/headers/HeaderSix"
// import HeaderThree from "../../../../layouts/headers/HeaderThree"
import BreadCrumb from "../../../common/BreadCrumb"
import CartArea from "./CartArea"

const Cart = () => {
   
   return (
      <>
         <HeaderSix />
         <main>
            <BreadCrumb title="Cart Page" sub_title="Cart" />
            <CartArea />
         </main>
         <FooterSix />
      </>
   )
}

export default Cart
