import React, { useState,  useCallback } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { fetchReviews } from "../../../../redux/features/reviewSlice";
import type { AppDispatch } from "../../../../redux/store";

interface DataType {
  id: number;
  title: string;
}

// Memoize static data
const review_data: DataType[] = [
  { id: 1, title: "Location :" },
  { id: 2, title: "Price :" },
  { id: 3, title: "Services :" },
];

const BASE_URL = import.meta.env.VITE_BASE_URL;

const ReviewFormArea = () => {
  const [ratings, setRatings] = useState<number[]>(review_data.map(() => 0));
  const [message, setMessage] = useState("");
  const [errors, setErrors] = useState<{ message?: string; ratings?: string }>({});
  const [loading, setLoading] = useState<boolean>(false);

  const params = useParams();
  const packageId = params.id;
  const dispatch = useDispatch<AppDispatch>();

  // Memoized validation
  const validateForm = useCallback(() => {
    const newErrors: typeof errors = {};
    if (!message.trim()) newErrors.message = "Message cannot be empty";
    if (ratings.some((r) => r === 0)) newErrors.ratings = "Please rate all categories";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [message, ratings]);

  // Memoized rating handler
  const handleRatingClick = useCallback((index: number, value: number) => {
    setRatings(prev => {
      const updated = [...prev];
      updated[index] = value;
      return updated;
    });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    const payload = {
      userId: localStorage.getItem("userId"),
      packageId: packageId,
      rating: Math.round(ratings.reduce((a, b) => a + b, 0) / ratings.length).toString(), // Average rating
      review: message,
      location: ratings[0].toString(),
      price: ratings[1].toString(),
      services: ratings[2].toString(),
    };

    try {
      setLoading(true);
      await axios.post(`${BASE_URL}/review`, payload,{
        headers:{
          Authorization:`Bearer ${localStorage.getItem('token')}`
        }
      });
      
      toast.success("Review Submitted");
      
      // Reset form
      setMessage("");
      setRatings(review_data.map(() => 0));
      setErrors({});
      
      // Refresh reviews
      dispatch(fetchReviews({ page: 1, limit: 2, packageId }));
      
    } catch (err) {
      console.error("Error submitting review:", err);
      toast.error("Failed to submit review. Try again.");
    } finally {
      setLoading(false);
    }
  };

  // Memoized star rendering
  const renderStars = useCallback((index: number) => {
    return [1, 2, 3, 4, 5].map((num) => (
      <i
        key={num}
        className={
          num <= ratings[index]
            ? "fa-solid fa-star text-warning"
            : "fa-regular fa-star"
        }
        onClick={() => handleRatingClick(index, num)}
        style={{ cursor: "pointer", marginRight: "5px" }}
      ></i>
    ));
  }, [ratings, handleRatingClick]);

  return (
    <div className="tg-tour-about-review-form-wrap mb-45">
      <h4 className="tg-tour-about-title mb-5">Leave a Reply</h4>

      <div className="tg-tour-about-rating-category mb-20">
        <ul>
          {review_data.map((item, idx) => (
            <li key={item.id}>
              <label>{item.title}</label>
              <div className="rating-icon">
                {renderStars(idx)}
              </div>
            </li>
          ))}
        </ul>
        {errors.ratings && <p style={{ color: "red" }}>{errors.ratings}</p>}
      </div>

      <div className="tg-tour-about-review-form">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-lg-12">
              <textarea
                className="textarea mb-5"
                placeholder="Write Message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={4}
              ></textarea>
              {errors.message && (
                <p style={{ color: "red" }}>{errors.message}</p>
              )}

              <button
                type="submit"
                className="tg-btn tg-btn-switch-animation mt-4"
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Review"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ReviewFormArea;