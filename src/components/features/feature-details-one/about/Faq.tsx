import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../../redux/store";
import { fetchPackageById } from "../../../../redux/features/placeDetailSlice";
import { useParams } from "react-router-dom";

interface FaqData {
  id: string | number;
  day: string;
  title: string;
  desc: string;
  showAnswer: boolean;
}

const Faq = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data } = useSelector((state: RootState) => state.placeDetail);
  const params = useParams();
  const packageId = params.id;

  const [faqData, setFaqData] = useState<FaqData[]>([]);

  useEffect(() => {
    if (!packageId) return;
    dispatch(fetchPackageById(packageId));
  }, [dispatch, packageId]);

  useEffect(() => {
    if (!data?.itinerary || !Array.isArray(data.itinerary)) return;

    const formatted = data.itinerary.map((item: any, index: number) => ({
      id: item.dayNumber || index + 1,
      day: `Day-${item.dayNumber}`,
      title: item.dayTitle,
      desc: item.description,
      showAnswer: index === 0, 
    }));

    setFaqData(formatted);
  }, [data]);

  const toggleAnswer = (faqId: number | string) => {
    setFaqData((prev) =>
      prev.map((faq) => ({
        ...faq,
        showAnswer: faq.id === faqId,
      }))
    );
  };

  return (
    <div className="tg-tour-faq-wrap mb-70">
      <h4 className="tg-tour-about-title mb-15">Tour Plan</h4>
      <p className="text-capitalize lh-28 mb-20">
        Explore your tour itinerary day by day below.
      </p>

      <div className="tg-tour-about-faq-inner">
        <div className="tg-tour-about-faq" id="accordionExample">
          {faqData.map((item) => (
            <div key={item.id} className="accordion-item">
              <h2 className="accordion-header">
                <button
                  className={`accordion-button ${
                    item.showAnswer ? "" : "collapsed"
                  }`}
                  onClick={() => toggleAnswer(item.id)}
                  type="button"
                >
                  <span>{item.day}</span> {item.title}
                </button>
              </h2>
              <div
                className={`accordion-collapse collapse ${
                  item.showAnswer ? "show" : ""
                }`}
              >
                <div className="accordion-body">
                  <p>{item.desc}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Faq;
