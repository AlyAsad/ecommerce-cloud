"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";

export default function Navbar() {
  const router = useRouter();
  const { user, setUser } = useAuth();

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    router.push("/");
  };

  return (
    <AppBar position="static" sx={{ borderRadius: 2, boxShadow: 3 }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <Link href="/" passHref style={{ textDecoration: "none", color: "inherit" }}>
          <Typography variant="h6" component="div">
            🏠 Home
          </Typography>
        </Link>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user ? (
            <>
              {user.isAdmin && (
                <Link href="/admin" passHref style={{ textDecoration: "none" }}>
                  <Button variant="contained" color="error">
                    Admin page
                  </Button>
                </Link>
              )}
              <Typography variant="body1">
                <Link
                  href="/user"
                  style={{ color: "inherit", textDecoration: "underline" }}
                >
                  {user.username}
                </Link>
              </Typography>
              <Button color="inherit" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" passHref style={{ textDecoration: "none", color: "inherit" }}>
                <Button color="inherit">Login</Button>
              </Link>
              <Link href="/signup" passHref style={{ textDecoration: "none", color: "inherit" }}>
                <Button color="inherit">Signup</Button>
              </Link>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
}
