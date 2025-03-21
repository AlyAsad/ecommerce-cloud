"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";
import {
  Container,
  Box,
  Typography,
  Button,
  Grid,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Checkbox,
  FormControlLabel,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
} from "@mui/material";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("addItem");
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");

  // Snackbar state for notifications
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "info" });
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Confirmation Dialog state for removals
  const [confirmDialog, setConfirmDialog] = useState({ open: false, type: "", id: "", message: "" });
  const openConfirmDialog = (type, id, message) => {
    setConfirmDialog({ open: true, type, id, message });
  };
  const closeConfirmDialog = () => {
    setConfirmDialog({ ...confirmDialog, open: false });
  };

  const handleConfirmRemove = async () => {
    const { type, id } = confirmDialog;
    closeConfirmDialog();
    if (type === "item") {
      const res = await fetch("/api/admin/item/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        setSnackbar({ open: true, message: "Item removed successfully", severity: "success" });
        // Refresh item list
        const res2 = await fetch("/api/admin/item/list");
        const data2 = await res2.json();
        setItems(data2.items);
      } else {
        setSnackbar({ open: true, message: data.error || "Error removing item", severity: "error" });
      }
    } else if (type === "user") {
      const res = await fetch("/api/admin/user/remove", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: id }),
      });
      const data = await res.json();
      if (res.ok) {
        setSnackbar({ open: true, message: "User removed successfully", severity: "success" });
        // Refresh user list:
        const res2 = await fetch("/api/admin/user/list");
        const data2 = await res2.json();
        setUsers(data2.users);
      } else {
        setSnackbar({ open: true, message: data.error || "Error removing user", severity: "error" });
      }
    }
  };

  // Redirect if not admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/");
    }
  }, [user, router]);

  // Fetch lists when component mounts
  useEffect(() => {
    async function fetchItems() {
      const res = await fetch("/api/admin/item/list");
      const data = await res.json();
      if (res.ok) {
        setItems(data.items);
      }
    }
    async function fetchUsers() {
      const res = await fetch("/api/admin/user/list");
      const data = await res.json();
      if (res.ok) {
        setUsers(data.users);
      }
    }
    fetchItems();
    fetchUsers();
  }, []);

  // --- Handlers for Add/Remove actions ---

  // 1. Add Item
  const handleAddItem = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    // Client-side validations using snackbar notifications
    if (selectedCategory === "GPS Sport Watches" && !payload.battery_life) {
      setSnackbar({ open: true, message: "Battery Life is required for GPS Sport Watches.", severity: "error" });
      return;
    }
    if ((selectedCategory === "Vinyls" || selectedCategory === "Antique Furniture") && !payload.age) {
      setSnackbar({ open: true, message: "Age is required for Vinyls and Antique Furniture.", severity: "error" });
      return;
    }
    if (selectedCategory === "Running Shoes" && !payload.size) {
      setSnackbar({ open: true, message: "Size is required for Running Shoes.", severity: "error" });
      return;
    }
    if ((selectedCategory === "Antique Furniture" || selectedCategory === "Running Shoes") && !payload.material) {
      setSnackbar({ open: true, message: "Material is required for Antique Furniture and Running Shoes.", severity: "error" });
      return;
    }
    try {
      new URL(payload.image);
    } catch (err) {
      setSnackbar({ open: true, message: "Please enter a valid image URL.", severity: "error" });
      return;
    }

    // Submit the new item
    const res = await fetch("/api/admin/item/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      setSnackbar({ open: true, message: "Item added successfully", severity: "success" });
      form.reset();
      setSelectedCategory("");
      // Refresh item list
      const res2 = await fetch("/api/admin/item/list");
      const data2 = await res2.json();
      setItems(data2.items);
    } else {
      setSnackbar({ open: true, message: data.error || "Error adding item", severity: "error" });
    }
  };

  // 3. Add User
  const handleAddUser = async (e) => {
    e.preventDefault();
    const form = e.target;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());
    payload.isAdmin = payload.isAdmin === "on";
    const res = await fetch("/api/admin/user/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (res.ok) {
      setSnackbar({ open: true, message: "User added successfully", severity: "success" });
      form.reset();
      // Refresh user list
      const res2 = await fetch("/api/admin/user/list");
      const data2 = await res2.json();
      setUsers(data2.users);
    } else {
      setSnackbar({ open: true, message: data.error || "Error adding user", severity: "error" });
    }
  };

  // Render functions for each tab

  // Add Item Tab with combined fields
  const renderAddItemTab = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Add Item
      </Typography>
      <Box component="form" onSubmit={handleAddItem} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Name" name="name" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                label="Category"
                name="category"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <MenuItem value="">
                  <em>Select a category</em>
                </MenuItem>
                <MenuItem value="Vinyls">Vinyls</MenuItem>
                <MenuItem value="Antique Furniture">Antique Furniture</MenuItem>
                <MenuItem value="GPS Sport Watches">GPS Sport Watches</MenuItem>
                <MenuItem value="Running Shoes">Running Shoes</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>
        <TextField label="Description" name="description" multiline rows={3} required />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField label="Price" name="price" fullWidth required />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField label="Seller" name="seller" fullWidth required />
          </Grid>
        </Grid>
        <TextField label="Image URL" name="image" fullWidth required placeholder="https://example.com/image.jpg" />
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Battery Life"
              name="battery_life"
              fullWidth
              disabled={selectedCategory !== "GPS Sport Watches"}
              sx={{
                backgroundColor: selectedCategory !== "GPS Sport Watches" ? "#eee" : "inherit",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Age"
              name="age"
              fullWidth
              disabled={!(selectedCategory === "Vinyls" || selectedCategory === "Antique Furniture")}
              sx={{
                backgroundColor:
                  !(selectedCategory === "Vinyls" || selectedCategory === "Antique Furniture") ? "#eee" : "inherit",
              }}
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Size"
              name="size"
              fullWidth
              disabled={selectedCategory !== "Running Shoes"}
              sx={{
                backgroundColor: selectedCategory !== "Running Shoes" ? "#eee" : "inherit",
              }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              label="Material"
              name="material"
              fullWidth
              disabled={!(selectedCategory === "Antique Furniture" || selectedCategory === "Running Shoes")}
              sx={{
                backgroundColor:
                  !(selectedCategory === "Antique Furniture" || selectedCategory === "Running Shoes") ? "#eee" : "inherit",
              }}
            />
          </Grid>
        </Grid>
        <Button type="submit" variant="contained">
          Add Item
        </Button>
      </Box>
    </Box>
  );

  const renderRemoveItemTab = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Remove Item
      </Typography>
      {items.map((item) => (
        <Box key={item._id} sx={{ border: "1px solid #ccc", p: 2, mb: 2, borderRadius: 1 }}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={3}>
              <Box
                component="img"
                src={item.image}
                alt={item.name}
                sx={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: 1 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom>
                <strong>{item.name}</strong> - ${item.price}
              </Typography>
              <Typography variant="body2">Category: {item.category}</Typography>
              <Typography variant="body2">
                Rating: {Number(item.rating || 0).toFixed(2)} stars ({item.num_of_ratings || 0} ratings)
              </Typography>
              <Typography variant="body2">
                Total Reviews: {item.reviews ? item.reviews.length : 0}
              </Typography>
              <Typography variant="body2">{item.description}</Typography>
            </Grid>
            <Grid item xs={12} sm={3}>
              <Button
                variant="outlined"
                color="error"
                onClick={() => openConfirmDialog("item", item._id, "Are you sure you want to remove this item?")}
              >
                Remove
              </Button>
            </Grid>
          </Grid>
        </Box>
      ))}
    </Box>
  );

  const renderAddUserTab = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Add User
      </Typography>
      <Box component="form" onSubmit={handleAddUser} sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
        <TextField label="Username" name="username" required />
        <TextField label="Password" name="password" type="password" required />
        <FormControlLabel control={<Checkbox name="isAdmin" />} label="Admin" />
        <Button type="submit" variant="contained">
          Add User
        </Button>
      </Box>
    </Box>
  );

  const renderRemoveUserTab = () => (
    <Box>
      <Typography variant="h5" gutterBottom>
        Remove User
      </Typography>
      {users.map((u) => (
        <Box key={u._id} sx={{ border: "1px solid #ccc", p: 2, mb: 2, borderRadius: 1 }}>
          <Typography variant="subtitle1" gutterBottom>
            <strong>{u.username}</strong> - {u.isAdmin ? "Admin" : "User"}
          </Typography>
          {u.ratings && u.ratings.length > 0 ? (
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Ratings:</strong>
              </Typography>
              {u.ratings.map((rating, idx) => {
                const item = items.find((it) => it._id === rating.itemId);
                const itemName = item ? item.name : rating.itemId;
                return (
                  <Typography key={idx} variant="body2">
                    {itemName}: {rating.rating} stars
                  </Typography>
                );
              })}
            </Box>
          ) : (
            <Typography variant="body2" gutterBottom>
              <strong>Ratings:</strong> None
            </Typography>
          )}
          {u.reviews && u.reviews.length > 0 ? (
            <Box sx={{ ml: 2 }}>
              <Typography variant="body2" gutterBottom>
                <strong>Reviews:</strong>
              </Typography>
              {u.reviews.map((review, idx) => {
                const item = items.find((it) => it._id === review.itemId);
                const itemName = item ? item.name : review.itemId;
                return (
                  <Typography key={idx} variant="body2">
                    {itemName}: {review.review}
                  </Typography>
                );
              })}
            </Box>
          ) : (
            <Typography variant="body2" gutterBottom>
              <strong>Reviews:</strong> None
            </Typography>
          )}
          <Button
            variant="outlined"
            color="error"
            onClick={() =>
              openConfirmDialog("user", u._id, "Are you sure you want to remove this user?")
            }
          >
            Remove
          </Button>
        </Box>
      ))}
    </Box>
  );
  
  

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Admin Page
      </Typography>
      <Box sx={{ mb: 3 }}>
        <Button
          variant={activeTab === "addItem" ? "contained" : "outlined"}
          onClick={() => setActiveTab("addItem")}
          sx={{ mr: 1 }}
        >
          Add Item
        </Button>
        <Button
          variant={activeTab === "removeItem" ? "contained" : "outlined"}
          onClick={() => setActiveTab("removeItem")}
          sx={{ mr: 1 }}
        >
          Remove Item
        </Button>
        <Button
          variant={activeTab === "addUser" ? "contained" : "outlined"}
          onClick={() => setActiveTab("addUser")}
          sx={{ mr: 1 }}
        >
          Add User
        </Button>
        <Button
          variant={activeTab === "removeUser" ? "contained" : "outlined"}
          onClick={() => setActiveTab("removeUser")}
        >
          Remove User
        </Button>
      </Box>
      {activeTab === "addItem" && renderAddItemTab()}
      {activeTab === "removeItem" && renderRemoveItemTab()}
      {activeTab === "addUser" && renderAddUserTab()}
      {activeTab === "removeUser" && renderRemoveUserTab()}

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={3000}
        onClose={handleSnackbarClose}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: "100%" }}>
          {snackbar.message}
        </Alert>
      </Snackbar>

      {/* Confirmation Dialog for removals */}
      <Dialog open={confirmDialog.open} onClose={closeConfirmDialog}>
        <DialogTitle>Confirmation</DialogTitle>
        <DialogContent>
          <DialogContentText>{confirmDialog.message}</DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeConfirmDialog}>Cancel</Button>
          <Button onClick={handleConfirmRemove} color="error">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
