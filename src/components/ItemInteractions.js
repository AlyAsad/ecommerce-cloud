"use client";

import { useState } from "react";
import RatingForm from "./RatingForm";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";

export default function ItemInteractions({
  itemId,
  initialAvgRating,
  initialNumRatings,
  initialReviews,
}) {
  const [avgRating, setAvgRating] = useState(initialAvgRating);
  const [numRatings, setNumRatings] = useState(initialNumRatings);
  const [reviews, setReviews] = useState(initialReviews);

  // Callback when rating is updated/submitted
  const handleRatingUpdate = (data) => {
    setAvgRating(data.newAverage);
    setNumRatings(data.newNumOfRatings);
  };

  // Callback when a review is submitted; re-fetch reviews automatically.
  const handleReviewSubmitted = async () => {
    try {
      const res = await fetch(`/api/items/${itemId}/reviews`);
      const data = await res.json();
      if (res.ok) {
        setReviews(data.reviews);
      }
    } catch (error) {
      console.error("Error refreshing reviews", error);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <div>
        <h3>
          Current Rating: {avgRating} stars ({numRatings} ratings)
        </h3>
      </div>
      <RatingForm itemId={itemId} onRatingUpdate={handleRatingUpdate} />
      <ReviewForm itemId={itemId} onReviewSubmitted={handleReviewSubmitted} />
      <ReviewList reviews={reviews} />
    </div>
  );
}
