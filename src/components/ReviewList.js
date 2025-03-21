"use client";

import { Box, Typography, Divider } from "@mui/material";

export default function ReviewList({ reviews }) {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Customer Reviews
      </Typography>
      {reviews && reviews.length > 0 ? (
        [...reviews].reverse().map((review, index) => (
          <Box key={index} sx={{ py: 2 }}>
            <Typography variant="subtitle1" component="span" sx={{ fontWeight: "bold" }}>
              {review.username}
            </Typography>
            <Typography variant="body2" component="span" sx={{ ml: 2, color: "text.secondary" }}>
              {review.date}
            </Typography>
            <Typography variant="body1" sx={{ mt: 1 }}>
              {review.data}
            </Typography>
            {index < reviews.length - 1 && <Divider sx={{ my: 2 }} />}
          </Box>
        ))
      ) : (
        <Typography>No reviews yet.</Typography>
      )}
    </Box>
  );
}
