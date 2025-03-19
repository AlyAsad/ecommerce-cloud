"use client";

import Link from "next/link";

export default function HeroSection({ topImages }) {
  const handleBrowse = () => {
    const section = document.getElementById("browse-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      style={{
        padding: "2rem",
        textAlign: "center",
        background: "linear-gradient(to right, #0077cc, #005faa)",
        color: "#fff",
        borderRadius: "10px",
      }}
    >
      <h1>E-commerce</h1>
      <div style={{ margin: "1rem 0" }}>
        <Link href="/about">
          <button style={{ marginRight: "1rem", padding: "0.5rem 1rem", borderRadius: "8px", border: "none" }}>Learn More</button>
        </Link>
        <button onClick={handleBrowse} style={{ padding: "0.5rem 1rem", borderRadius: "8px", border: "none" }}>Browse</button>
      </div>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "1rem",
          flexWrap: "wrap",
          marginTop: "2rem",
        }}
      >
        {topImages.map((item, idx) => (
          <img
            key={idx}
            src={`/images/items/${item.image}`}
            alt={item.name}
            style={{
              width: "200px",
              height: "200px",
              objectFit: "cover",
              borderRadius: "8px",
            }}
          />
        ))}
      </div>
    </section>
  );
}