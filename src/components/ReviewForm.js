"use client";

import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Box, Typography, TextField, Button, Alert } from "@mui/material";

export default function ReviewForm({ itemId, onReviewSubmitted }) {
  const { user } = useAuth();
  const [review, setReview] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    if (!user) {
      setMessage("Please log in to submit a review.");
      return;
    }
    const res = await fetch(`/api/items/${itemId}/review`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ review, userId: user.userId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Error submitting review");
    } else {
      setMessage("Review submitted successfully");
      setReview("");
      if (onReviewSubmitted) onReviewSubmitted();
    }
  };

  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Leave a review
      </Typography>
      {user ? (
        <Box component="form" onSubmit={handleSubmit} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Review"
            multiline
            minRows={3}
            value={review}
            onChange={(e) => setReview(e.target.value)}
            required
          />
          <Button type="submit" variant="contained">
            Submit Review
          </Button>
        </Box>
      ) : (
        <Typography>Please log in to leave a review.</Typography>
      )}
      {message && (
        <Alert severity={message.toLowerCase().includes("error") ? "error" : "success"}>
          {message}
        </Alert>
      )}
    </Box>
  );
}
