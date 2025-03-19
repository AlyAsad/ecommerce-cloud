"use client";

import { useState, useEffect } from "react";

export default function RatingForm({ itemId, onRatingUpdate }) {
  const [userId, setUserId] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // For demo purposes, assume userId is stored in localStorage.
    const uid = localStorage.getItem("userId");
    setUserId(uid);
    if (uid) {
      fetch(`/api/items/${itemId}/user-rating?userId=${uid}`)
        .then(res => res.json())
        .then(data => {
          if (data.userRating) {
            setSelectedRating(data.userRating);
          }
          setLoading(false);
        })
        .catch(err => {
          console.error(err);
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, [itemId]);

  const handleRatingClick = async (value) => {
    if (!userId) {
      setMessage("Please log in to submit a rating.");
      return;
    }
    const res = await fetch(`/api/items/${itemId}/rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: value, userId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Error submitting rating");
    } else {
      setMessage(data.message);
      setSelectedRating(value);
      if (onRatingUpdate) onRatingUpdate(data);
    }
  };

  const handleRemoveRating = async () => {
    if (!userId) {
      setMessage("Please log in to remove your rating.");
      return;
    }
    const res = await fetch(`/api/items/${itemId}/rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: 0, userId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Error removing rating");
    } else {
      setMessage(data.message);
      setSelectedRating(0);
      if (onRatingUpdate) onRatingUpdate(data);
    }
  };

  if (loading) {
    return <p>Loading rating...</p>;
  }

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Rate this item</h2>
      {userId ? (
        <div>
          <button
            onClick={handleRemoveRating}
            style={{
              margin: "0 0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
              fontWeight: selectedRating === 0 ? "bold" : "normal",
            }}
          >
            Remove
          </button>
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              onClick={() => handleRatingClick(value)}
              style={{
                margin: "0 0.5rem",
                padding: "0.5rem 1rem",
                backgroundColor: selectedRating === value ? "#ddd" : "#fff",
                border: "1px solid #ccc",
                borderRadius: "4px",
                cursor: "pointer",
              }}
            >
              {value}
            </button>
          ))}
        </div>
      ) : (
        <p>Please log in to rate this item.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}
