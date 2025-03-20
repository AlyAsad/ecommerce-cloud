"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

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
    <div style={{ marginTop: "2rem" }}>
      <h2>Leave a review</h2>
      {user ? (
        <form onSubmit={handleSubmit}>
          <div>
            <label>Review: </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              required
            />
          </div>
          <button type="submit">Submit Review</button>
        </form>
      ) : (
        <p>Please log in to leave a review.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}
