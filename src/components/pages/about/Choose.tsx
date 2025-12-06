import { useEffect, type ReactNode } from "react";
import Choose6 from "../../../svg/home-one/Choose6";
import Choose7 from "../../../svg/home-one/Choose7";
import Choose8 from "../../../svg/home-one/Choose8";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { fetchAbout } from "../../../redux/features/aboutSlice";

interface DataType {
   id: number;
   icon: ReactNode;
   title: string;
   desc: string;
}

const choose_data: DataType[] = [
   {
      id: 1,
      icon: (<><Choose6 /></>),
      title:  "Ultimate flexibility",
      desc: "when an unknown printer took galleof type and scrambled make type peci bookhas survived five.",
   },
   {
      id: 2,
      icon: (<><Choose7 /></>),
      title: "Memorable experiences",
      desc: "when an unknown printer took galleof type and scrambled make type peci bookhas survived five.",
   },
   {
      id: 3,
      icon: (<><Choose8 /></>),
      title: "Award winning support",
      desc: "when an unknown printer took galleof type and scrambled make type peci bookhas survived five.",
   },
];




const Choose = () => {
   
   const dispatch = useDispatch<AppDispatch>();
   const {data}=useSelector((state:RootState)=>state.about)
   useEffect(()=>{
      dispatch(fetchAbout())
   },[dispatch])


  const apiFeatures = data?.whatWeDo?.features;

  const customizedData =
    apiFeatures && apiFeatures.length > 0
      ? apiFeatures.map((item: any, index: number) => ({
          id: item._id || index,
          title: item.title || choose_data[index]?.title,
          desc: item.description || choose_data[index]?.desc,
          icon: choose_data[index]?.icon || <Choose6 />, // fallback icon
        }))
      : choose_data; 
   return (
      <div className="tg-chose-area tg-grey-bg pt-140 pb-70 p-relative z-index-1">
         <img className="tg-chose-6-shape d-none d-md-block" src="/assets/img/banner/banner-2/shape.png" alt="" />
         <div className="container">
            <div className="row justify-content-center">
               <div className="col-xl-6 col-lg-7 col-md-9">
                  <div className="tg-chose-section-title text-center mb-35">
                     <h5 className="tg-section-subtitle mb-15 wow fadeInUp" data-wow-delay=".3s" data-wow-duration=".1s">What we do</h5>
                     <h2 className="mb-15 text-capitalize wow fadeInUp" data-wow-delay=".4s" data-wow-duration=".9s">We Arrange the Best Tour<br /> Ever Possible</h2>
                     <p className="text-capitalize wow fadeInUp mb-35" data-wow-delay=".5s" data-wow-duration=".9s">when an unknown printer took a galley of type and scrambled make type
                        specimen bookhas survived not only five.</p>
                  </div>
               </div>
            </div>
            <div className="row">
               { customizedData &&  customizedData.map((item) => (
                  <div key={item.id} className="col-lg-4 col-md-6">
                     <div className="tg-chose-6-wrap mb-30">
                        <span className="icon mb-20">{item.icon}</span>
                        <h4 className="tg-chose-6-title mb-15">{item.title}</h4>
                        <p>{item.desc}</p>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default Choose
