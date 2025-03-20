"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function InteractiveRating({ itemId, initialRating, initialNumRatings }) {
  const { user } = useAuth();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [avgRating, setAvgRating] = useState(initialRating);
  const [numRatings, setNumRatings] = useState(initialNumRatings);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetch(`/api/items/${itemId}/user-rating?userId=${user.userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.userRating) {
            setSelectedRating(Number(data.userRating));
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error("Error fetching user rating:", err);
          setLoading(false);
        });
    } else {
      setLoading(false);
      setSelectedRating(0);
    }
  }, [itemId, user]);

  const handleRatingClick = async (value) => {
    if (!user) {
      setMessage("Please log in to submit a rating.");
      return;
    }
    const res = await fetch(`/api/items/${itemId}/rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: value, userId: user.userId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Error submitting rating");
    } else {
      setMessage(data.message);
      setSelectedRating(value);
      setAvgRating(data.newAverage);
      setNumRatings(data.newNumOfRatings);
    }
  };

  const handleRemoveRating = async () => {
    if (!user) {
      setMessage("Please log in to remove your rating.");
      return;
    }
    const res = await fetch(`/api/items/${itemId}/rating`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ rating: 0, userId: user.userId }),
    });
    const data = await res.json();
    if (!res.ok) {
      setMessage(data.error || "Error removing rating");
    } else {
      setMessage(data.message);
      setSelectedRating(0);
      setAvgRating(data.newAverage);
      setNumRatings(data.newNumOfRatings);
    }
  };

  if (loading) {
    return <p>Loading rating...</p>;
  }

  const displayRating = hoverRating || selectedRating;

  return (
    <div style={{ marginTop: "2rem" }}>
      <p>
        <strong>Rating:</strong> {avgRating} stars ({numRatings} ratings)
      </p>
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
      {message && <p>{message}</p>}
    </div>
  );
}
