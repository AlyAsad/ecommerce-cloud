"use client";

import { useState } from "react";
import Link from "next/link";

export default function BrowseSection({ items, categories }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter((item) => item.category === selectedCategory);

  return (
    <section id="browse-section" style={{ padding: "2rem", backgroundColor: "#f5f5f5" }}>
      {/* Category Buttons */}
      <div style={{ marginBottom: "1rem", textAlign: "center" }}>
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            style={{
              margin: "0 0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: selectedCategory === cat.value ? "#ddd" : "#fff",
              border: "1px solid #ccc",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Items Grid */}
      <div
        style={{
          display: "grid",
          gap: "1rem",
          gridTemplateColumns: "repeat(auto-fit, 250px)",
          justifyContent: "center",
        }}
      >
        {filteredItems.map((item) => (
          <Link 
            href={`/items/${item._id}`} 
            key={item._id}
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div
              style={{
                border: "1px solid #ccc",
                borderRadius: "8px",
                padding: "0.5rem",
              }}
            >
              <img
                src={item.image}
                alt={item.name}
                style={{
                  width: "100%",
                  height: "120px",
                  objectFit: "cover",
                  borderRadius: "4px",
                }}
              />
              <h3 style={{ margin: "0.5rem 0" }}>{item.name}</h3>
              <p style={{ margin: "0.5rem 0" }}>${item.price}</p>
              <p style={{ margin: "0.5rem 0" }}>
                {item.rating ? item.rating : "N/A"} stars (
                {item.num_of_ratings ? item.num_of_ratings : "0"} ratings)
              </p>
              <p style={{ 
                margin: "0.5rem 0",
                display: "-webkit-box",
                WebkitLineClamp: 2,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
                minHeight: "2.3em",
              }}>
                {item.description}
              </p>
            </div>
          </Link>
        ))}
        {filteredItems.length === 0 && <p>No items found in this category.</p>}
      </div>
    </section>
  );
}
