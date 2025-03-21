"use client";

import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Container,
  Paper,
  Box,
  Typography,
  List,
  ListItem,
  Divider,
  Alert,
  CircularProgress,
  Avatar,
} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

export default function UserPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [details, setDetails] = useState(null);
  const [itemsMap, setItemsMap] = useState({});
  const [loading, setLoading] = useState(true);

  // Redirect immediately if no user
  useEffect(() => {
    if (!user) {
      router.push("/");
    }
  }, [user, router]);

  // Fetch user details using the userId
  useEffect(() => {
    if (user) {
      async function fetchDetails() {
        try {
          const res = await fetch(`/api/user/details?userId=${user.userId}`);
          if (res.ok) {
            const data = await res.json();
            setDetails(data);
          } else {
            setDetails(null);
          }
        } catch (error) {
          console.error("Error fetching user details", error);
          setDetails(null);
        }
      }
      fetchDetails();
    }
  }, [user]);

  // Fetch items from the admin endpoint and build a mapping from item IDs to names
  useEffect(() => {
    async function fetchItems() {
      try {
        // Use the admin items endpoint instead of /api/items
        const res = await fetch(`/api/admin/item/list`);
        if (res.ok) {
          const data = await res.json();
          const map = {};
          data.items.forEach((item) => {
            // Convert _id to string for proper matching
            map[item._id.toString()] = item.name;
          });
          console.log("Items Map:", map);
          setItemsMap(map);
        }
      } catch (error) {
        console.error("Error fetching items:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchItems();
  }, []);

  if (loading) {
    return (
      <Container sx={{ py: 4 }}>
        <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!details) {
    return (
      <Container sx={{ py: 4 }}>
        <Alert severity="error">Failed to load user details.</Alert>
      </Container>
    );
  }

  // Ensure user is defined before accessing its properties
  if (!user) {
    router.push("/");
    return null;
  }

  const role = user.isAdmin ? "Admin" : "Regular User";

  return (
    <Container sx={{ py: 4 }}>
      <Paper sx={{ p: 4, mb: 4 }}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
          <Avatar sx={{ width: 56, height: 56 }}>
            <AccountCircleIcon fontSize="large" />
          </Avatar>
          <Box>
            <Typography variant="h5">{details.username}</Typography>
            <Typography variant="body2" color="text.secondary">
              Role: {role}
            </Typography>
          </Box>
        </Box>
        <Divider sx={{ mb: 2 }} />
        <Typography variant="body1">
          <strong>Average Rating:</strong>{" "}
          {details.averageRating ? Number(details.averageRating).toFixed(2) : "N/A"}
        </Typography>
      </Paper>

      <Paper sx={{ p: 3, mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          All Ratings
        </Typography>
        {details.ratings && details.ratings.length > 0 ? (
          <List>
            {details.ratings.map((r, idx) => {
              // Ensure itemId is a string before lookup
              const key = r.itemId.toString();
              console.log("Rating itemId:", key);
              const itemName = itemsMap[key] || key;
              return (
                <ListItem key={idx}>
                  <Typography variant="body2">
                    {itemName}: {r.rating} stars
                  </Typography>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Typography variant="body2">No ratings given.</Typography>
        )}
      </Paper>

      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" gutterBottom>
          Reviews
        </Typography>
        {details.reviews && details.reviews.length > 0 ? (
          <List>
            {details.reviews.map((rev, idx) => {
              const key = rev.itemId.toString();
              const itemName = itemsMap[key] || key;
              return (
                <ListItem key={idx}>
                  <Typography variant="body2">
                    {itemName}: {rev.review}
                  </Typography>
                </ListItem>
              );
            })}
          </List>
        ) : (
          <Typography variant="body2">No reviews written.</Typography>
        )}
      </Paper>
    </Container>
  );
}
