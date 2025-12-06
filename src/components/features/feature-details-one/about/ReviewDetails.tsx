import { useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { useEffect, useCallback, useMemo } from 'react';
import { fetchReviews } from "../../../../redux/features/reviewSlice";

const ReviewDetails = () => {
  const dispatch = useAppDispatch();
  const { reviews, pagination, loading, error } = useAppSelector((state) => state.review);
  
  const params = useParams(); 
  const packageId = params.id;

  // Memoized fetch function
  const fetchReviewsCallback = useCallback(() => {
    if (packageId) {
      dispatch(fetchReviews({ page: 1, limit: 5, packageId }));
    }
  }, [dispatch, packageId]);

  useEffect(() => {
    fetchReviewsCallback();
  }, [fetchReviewsCallback]);

  // Memoized utility functions
  const formatDate = useCallback((dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-Gb",{
                                  day:'2-digit',
                                  month:'numeric',
                                  year:'2-digit'
                                })
    } catch (error) {
      return 'Invalid date';
    }
  }, []);

  const renderStars = useCallback((rating: number) => {
    const safeRating = Math.max(0, Math.min(5, rating || 0)); 
    return Array.from({ length: 5 }, (_, index) => (
      <i 
        key={index}
        className={`fa-sharp fa-solid fa-star ${index < safeRating ? 'text-warning' : 'text-light'}`}
      ></i>
    ));
  }, []);

  // Memoized computed values
  const safeReviews = useMemo(() => Array.isArray(reviews) ? reviews : [], [reviews]);
  const reviewCount = useMemo(() => pagination?.totalItems || safeReviews.length, [pagination, safeReviews]);

  // Loading state
  if (loading) {
    return (
      <div className="tg-tour-about-cus-review-wrap mb-25">
        <h4 className="tg-tour-about-title mb-40">Reviews</h4>
        <div className="text-center py-4">Loading reviews...</div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="tg-tour-about-cus-review-wrap mb-25">
        <h4 className="tg-tour-about-title mb-40">Reviews</h4>
        <div className="alert alert-danger text-center">
          Error loading reviews: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="tg-tour-about-cus-review-wrap mb-25">
      <h4 className="tg-tour-about-title mb-40">
        {reviewCount} Reviews
      </h4>
      
      {safeReviews.length === 0 ? (
        <div className="text-center py-4 text-muted">
          No reviews yet. Be the first to review!
        </div>
      ) : (
        <ul>
          {safeReviews.map((review, index) => (
            <ReviewItem 
              key={review._id || index}
              review={review}
              index={index}
              totalReviews={safeReviews.length}
              formatDate={formatDate}
              renderStars={renderStars}
            />
          ))}
        </ul>
      )}
    </div>
  );
}

// Extract review item as separate component for better performance
const ReviewItem = ({ review, index, totalReviews, formatDate, renderStars }: any) => (
  <li>
    <div className="tg-tour-about-cus-review d-flex mb-40">
      <div className="tg-tour-about-cus-review-thumb">
        <img 
          src={review.userId?.avatarUrl || "/assets/img/tour-details/avatar.png"} 
          alt={review.userId?.firstName || 'User'}
          className="rounded-circle"
          style={{ width: '60px', height: '60px', objectFit: 'cover' }}
          onError={(e) => {
            e.currentTarget.src = "/assets/img/tour-details/avatar.png";
          }}
        />
      </div>
      <div className="ms-3 flex-grow-1">
        <div className="tg-tour-about-cus-name mb-5 d-flex align-items-center justify-content-between flex-wrap">
          <h6 className="mr-10 mb-10 d-inline-block">
            {review.userId?.firstName || 'Anonymous User'} 
            <span className="text-muted ms-2">- {formatDate(review.createdAt)}</span>
          </h6>
          <span className="tg-tour-about-cus-review-star mb-10 d-inline-block">
            {renderStars(review.rating)}
          </span>
        </div>
        <p className="text-capitalize lh-28 mb-10">
          {review.review || 'No review text provided.'}
        </p>
        
        {/* Additional ratings if available */}
        {(review.location || review.price || review.services) && (
          <AdditionalRatings review={review} />
        )}
      </div>
    </div>
    {index < totalReviews - 1 && (
      <div className="tg-tour-about-border mb-40"></div>
    )}
  </li>
);

// Extract additional ratings component
const AdditionalRatings = ({ review }: any) => (
  <div className="additional-ratings mb-10 d-flex flex-wrap gap-3">
    {review.location !== undefined && (
      <small className="text-muted">
        <strong>Location:</strong> {review.location}/5
      </small>
    )}
    {review.price !== undefined && (
      <small className="text-muted">
        <strong>Price:</strong> {review.price}/5
      </small>
    )}
    {review.services !== undefined && (
      <small className="text-muted">
        <strong>Services:</strong> {review.services}/5
      </small>
    )}
  </div>
);

export default ReviewDetails;