"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const [searchValue, setSearchValue] = useState("");
  const router = useRouter();
  const { user, setUser } = useAuth();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log("Search:", searchValue);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <nav
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "1rem 2rem",
        backgroundColor: "#0077cc",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Link
        href="/"
        style={{
          fontSize: "1.2rem",
          fontWeight: "bold",
          color: "#fff",
        }}
      >
        🏠 Home
      </Link>
      <form onSubmit={handleSearchSubmit} style={{ flex: 1, marginLeft: "1rem", marginRight: "1rem" }}>
        <input
          type="text"
          placeholder="Search..."
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          style={{
            width: "250px",
            padding: "0.5rem",
            borderRadius: "8px",
            border: "none",
            outline: "none",
          }}
        />
      </form>
      <div style={{ display: "flex", gap: "1rem", color: "#fff" }}>
        {user ? (
          <>
            {user.isAdmin && (
              <Link href="/admin" style={{ color: "#fff" }}>
                Admin page
              </Link>
            )}
            <span>{user.username}</span>
            <span>|</span>
            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "none",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link href="/login" style={{ color: "#fff" }}>
              Login
            </Link>
            <Link href="/signup" style={{ color: "#fff" }}>
              Signup
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
