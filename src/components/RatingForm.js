"use client";

import { useState, useEffect } from "react";

export default function RatingForm({ itemId, onRatingUpdate }) {
  const [userId, setUserId] = useState(null);
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Retrieve the full user object from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUserId(parsedUser.userId);
      fetch(`/api/items/${itemId}/user-rating?userId=${parsedUser.userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.userRating) {
            setSelectedRating(Number(data.userRating));
          }
          setLoading(false);
        })
        .catch((err) => {
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

  const displayRating = hoverRating || selectedRating;

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Rate this item</h2>
      {userId ? (
        <div style={{ display: "flex", alignItems: "center" }}>
          <button
            onClick={handleRemoveRating}
            style={{
              marginRight: "1rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            Remove
          </button>
          <div>
            {[...Array(10)].map((_, index) => {
              const starValue = index + 1;
              return (
                <span
                  key={starValue}
                  onMouseEnter={() => setHoverRating(starValue)}
                  onMouseLeave={() => setHoverRating(0)}
                  onClick={() => handleRatingClick(starValue)}
                  style={{
                    cursor: "pointer",
                    fontSize: "1.5rem",
                    color: displayRating >= starValue ? "#FFD700" : "#ccc",
                    marginRight: "2px",
                  }}
                >
                  {displayRating >= starValue ? "★" : "☆"}
                </span>
              );
            })}
          </div>
        </div>
      ) : (
        <p>Please log in to rate this item.</p>
      )}
      {message && <p>{message}</p>}
    </div>
  );
}
