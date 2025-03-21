"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Box, Typography, Button, IconButton, Snackbar, Alert } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import StarBorderIcon from "@mui/icons-material/StarBorder";

export default function InteractiveRating({ itemId, initialRating, initialNumRatings }) {
  const { user } = useAuth();
  const [selectedRating, setSelectedRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [avgRating, setAvgRating] = useState(initialRating);
  const [numRatings, setNumRatings] = useState(initialNumRatings);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

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

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };

  const updateRatingValues = (newAvg, newCount) => {
    const validatedAvg = isNaN(Number(newAvg)) ? 0 : Number(newAvg);
    const validatedCount = isNaN(Number(newCount)) ? 0 : Number(newCount);
    setAvgRating(validatedAvg);
    setNumRatings(validatedCount);
  };

  const handleRatingClick = async (value) => {
    if (!user) {
      setMessage("Please log in to submit a rating.");
      setSnackbarOpen(true);
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
      updateRatingValues(data.newAverage, data.newNumOfRatings);
    }
    setSnackbarOpen(true);
  };

  const handleRemoveRating = async () => {
    if (!user) {
      setMessage("Please log in to remove your rating.");
      setSnackbarOpen(true);
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
      updateRatingValues(data.newAverage, data.newNumOfRatings);
    }
    setSnackbarOpen(true);
  };

  if (loading) {
    return <Typography>Loading rating...</Typography>;
  }

  const displayRating = hoverRating || selectedRating;

  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="body1">
        <strong>Rating:</strong> {Number(avgRating).toFixed(2)} stars ({numRatings} ratings)
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
        <Button variant="outlined" onClick={handleRemoveRating} sx={{ mr: 2 }}>
          Remove
        </Button>
        <Box>
          {[...Array(10)].map((_, index) => {
            const starValue = index + 1;
            return (
              <IconButton
                key={starValue}
                onMouseEnter={() => setHoverRating(starValue)}
                onMouseLeave={() => setHoverRating(0)}
                onClick={() => handleRatingClick(starValue)}
                size="small"
              >
                {displayRating >= starValue ? (
                  <StarIcon sx={{ color: "#FFD700", fontSize: "1.5rem" }} />
                ) : (
                  <StarBorderIcon sx={{ color: "#ccc", fontSize: "1.5rem" }} />
                )}
              </IconButton>
            );
          })}
        </Box>
      </Box>

      {/* Snackbar for feedback */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleCloseSnackbar} severity="info" sx={{ width: "100%" }}>
          {message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
