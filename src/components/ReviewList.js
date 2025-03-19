"use client";

import { useState, useEffect } from "react";

export default function ReviewList({ itemId, initialReviews }) {
  const [reviews, setReviews] = useState(initialReviews || []);

  const refreshReviews = async () => {
    const res = await fetch(`/api/items/${itemId}/reviews`);
    const data = await res.json();
    if (res.ok) {
      setReviews(data.reviews);
    }
  };

  useEffect(() => {
    // Optionally refresh reviews on mount.
    // refreshReviews();
  }, [itemId]);

  return (
    <div>
      <h2>Customer Reviews</h2>
      {reviews && reviews.length > 0 ? (
        reviews.map((review, index) => (
          <div key={index} style={{ borderBottom: "1px solid #ccc", padding: "1rem 0" }}>
            <p>
              <strong>{review.username}</strong>
              <span style={{ marginLeft: "1rem", color: "#666" }}>{review.date}</span>
            </p>
            <p>{review.data}</p>
          </div>
        ))
      ) : (
        <p>No reviews yet.</p>
      )}
      <button onClick={refreshReviews}>Refresh Reviews</button>
    </div>
  );
}
