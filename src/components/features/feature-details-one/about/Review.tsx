import { useEffect, useCallback, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../hooks/redux';
import { fetchReviews } from '../../../../redux/features/reviewSlice'; 

interface ReviewData {
  totalRating: number;
  totalReview: number;
  location: number;
  price: number;
  services: number;
  amenities?: number;
  rooms?: number;
}

const Review = () => {
  const dispatch = useAppDispatch();
  const { reviews, pagination, loading, error } = useAppSelector((state) => state.review);
  
  const params = useParams();
  const packageId = params.id;

  // Memoized fetch function using Redux
  const fetchReview = useCallback(() => {
    if (packageId) {
      dispatch(fetchReviews({ page: 1, limit: 5, packageId }));
    }
  }, [dispatch, packageId]);

  useEffect(() => {
    fetchReview();
  }, [fetchReview]);

  // Calculate aggregated review data from Redux state
  const review: ReviewData | null = useMemo(() => {
    if (!reviews || reviews.length === 0) return null;

    const totalReviews = pagination?.totalItems || reviews.length;
    
    // Calculate averages from all reviews
    const totals = reviews.reduce((acc, review) => ({
      totalRating: acc.totalRating + (review.rating || 0),
      location: acc.location + (review.location || 0),
      price: acc.price + (review.price || 0),
      services: acc.services + (review.services || 0),
      count: acc.count + 1
    }), { totalRating: 0, location: 0, price: 0, services: 0, count: 0 });

    return {
      totalRating: totals.count > 0 ? totals.totalRating / totals.count : 0,
      totalReview: totalReviews,
      location: totals.count > 0 ? totals.location / totals.count : 0,
      price: totals.count > 0 ? totals.price / totals.count : 0,
      services: totals.count > 0 ? totals.services / totals.count : 0,
    };
  }, [reviews, pagination]);

  // Memoized calculations
  const calculatePercentage = useCallback((rating: number) => {
    return `${(rating / 5) * 100}%`;
  }, []);

  const formatRating = useCallback((rating: number) => {
    return `${rating.toFixed(1)}/5`;
  }, []);

  // Memoized review categories to avoid recreation on every render
  const reviewCategories = useMemo(() => [
    { key: 'location', label: 'Location', value: review?.location || 0 },
    { key: 'services', label: 'Services', value: review?.services || 0 },
    { key: 'price', label: 'Price', value: review?.price || 0 },
  ], [review]);

  if (loading) {
    return (
      <div className="tg-tour-about-review-wrap mb-45">
        <div className="text-center">Loading reviews...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="tg-tour-about-review-wrap mb-45">
        <div className="text-center text-danger">{error}</div>
      </div>
    );
  }

  if (!review || (pagination?.totalItems === 0)) {
    return (
      <div className="tg-tour-about-review-wrap mb-45">
        <div className="text-center">No reviews found</div>
      </div>
    );
  }

  return (
    <div className="tg-tour-about-review-wrap mb-45">
      <h4 className="tg-tour-about-title mb-15">Customer Reviews</h4>
      <p className="text-capitalize lh-28 mb-20">
        Castle in one day is next to impossible. Designed specifically for travelers with limited time in London, this tour allows you to check off a range of southern England's historical attractions.
      </p>
      <div className="tg-tour-about-review">
        <div className="head-reviews">
          <div className="review-left">
            <div className="review-info-inner">
              <h2>{review.totalRating.toFixed(1)}</h2>
              <span>Excellent</span>
              <p>Based On {review.totalReview} Reviews</p>
            </div>
          </div>
          <div className="review-right">
            <div className="review-progress">
              {reviewCategories.map((category) => (
                <div key={category.key} className="item-review-progress">
                  <div className="text-rv-progress">
                    <p>{category.label}</p>
                  </div>
                  <div className="bar-rv-progress">
                    <div className="progress">
                      <div 
                        className="progress-bar" 
                        style={{ width: calculatePercentage(category.value) }}
                      ></div>
                    </div>
                  </div>
                  <div className="text-avarage">
                    <p>{formatRating(category.value)}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Review;