import { useEffect,useMemo, type JSX } from "react";
import Counter1 from "../../../svg/home-one/Counter1";
import Counter2 from "../../../svg/home-one/Counter2";
import Counter3 from "../../../svg/home-one/Counter3";
import Counter4 from "../../../svg/home-one/Counter4";
import Count from "../../common/Count";
import { fetchHomeData } from "../../../redux/features/homeSlice";
import { useSelector } from 'react-redux';
import type { AppDispatch, RootState } from "../../../redux/store";
import { useDispatch } from 'react-redux';

interface DataType {
   id: number;
   icon: JSX.Element;
   title: string;
   count: number;
}

const counter_data: DataType[] = [
   {
      id: 1,
      icon: (<><Counter1 /></>),
      title: "Happy Clients",
      count: 65
   },
   {
      id: 2,
      icon: (<><Counter2 /></>),
      title: "Country Tour",
      count: 10
   },
   {
      id: 3,
      icon: (<><Counter3 /> </>),
      title: "Tourism Award",
      count: 0
   },
   {
      id: 4,
      icon: (<><Counter4 /></>),
      title: "Skilled Support",
      count: 0
   },
];

const Counter = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector(
    (state: RootState) => state.home
  );

  useEffect(() => {
    dispatch(fetchHomeData());
  }, [dispatch]);


  const bannerData = useMemo(() => {
    const apiItem = data?.find((item: any) => item._id === "STATS_SECTION");
    return apiItem?.banners?.[0] || null;
  }, [data]);

  const customizedData = bannerData?.items.map((item:any,index:number)=>({
   id:item._id,
   title:item.title,
   count:item.subtitle,
   icon:counter_data[index].icon

  }))

   return (
      <div className="tg-counter-area pb-90">
         <div className="container">
            <div className="row">
               {customizedData && customizedData.map((item:any) => (
                  <div key={item.id} className="col-lg-3 col-md-6 col-sm-6  mb-30">
                     <div className="tg-counter-item d-flex align-items-center">
                        <span className="tg-counter-icon d-inline-block mr-20">
                           {item.icon}
                        </span>
                        <div className="tg-counter-content p-relative">
                           <h2 className="tg-counter-title count"><span className="odometer" data-count="65"><Count number={item.count} /></span>K</h2>
                           <span className="tg-counter-subtitle">{item.title}</span>
                        </div>
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>
   )
}

export default Counter
