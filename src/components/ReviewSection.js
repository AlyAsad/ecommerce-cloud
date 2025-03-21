"use client";

import { useState } from "react";
import ReviewForm from "./ReviewForm";
import ReviewList from "./ReviewList";
import { Box } from "@mui/material";

export default function ReviewSection({ itemId, initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews);

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
    <Box sx={{ mt: 4 }}>
      <ReviewForm itemId={itemId} onReviewSubmitted={handleReviewSubmitted} />
      <ReviewList reviews={reviews} />
    </Box>
  );
}
