"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export default function InteractiveRating({ itemId, initialRating, initialNumRatings }) {
  const { user } = useAuth(); // get the current user from context
  const [selectedRating, setSelectedRating] = useState(0);
  const [avgRating, setAvgRating] = useState(initialRating);
  const [numRatings, setNumRatings] = useState(initialNumRatings);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      // use the user from context
      fetch(`/api/items/${itemId}/user-rating?userId=${user.userId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.userRating) {
            setSelectedRating(data.userRating);
          }
          setLoading(false);
        })
        .catch((err) => {
          console.error(err);
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

  return (
    <div style={{ margin: "1rem 0" }}>
      <p>
        <strong>Rating:</strong> {avgRating} stars ({numRatings} ratings)
      </p>
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
      {message && <p>{message}</p>}
    </div>
  );
}
