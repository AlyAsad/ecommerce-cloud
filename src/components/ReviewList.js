"use client";

export default function ReviewList({ reviews }) {
  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Customer Reviews</h2>
      {reviews && reviews.length > 0 ? (
        [...reviews].reverse().map((review, index) => (
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
    </div>
  );
}
