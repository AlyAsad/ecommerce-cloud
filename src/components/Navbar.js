"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const router = useRouter();
  const { user, setUser } = useAuth();

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
