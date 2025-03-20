"use client";

import { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const { user } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("addItem");
  const [items, setItems] = useState([]);
  const [users, setUsers] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");


  // Redirect if not admin
  useEffect(() => {
    if (!user || !user.isAdmin) {
      router.push("/");
    }
  }, [user, router]);

  // Fetch lists when component mounts (for removal lists)
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
  
    // Client-side validation for enabled fields:
    if (selectedCategory === "GPS Sport Watches" && !payload.battery_life) {
      alert("Battery Life is required for GPS Sport Watches.");
      return;
    }
    if ((selectedCategory === "Vinyls" || selectedCategory === "Antique Furniture") && !payload.age) {
      alert("Age is required for Vinyls and Antique Furniture.");
      return;
    }
    if (selectedCategory === "Running Shoes" && !payload.size) {
      alert("Size is required for Running Shoes.");
      return;
    }
    if ((selectedCategory === "Antique Furniture" || selectedCategory === "Running Shoes") && !payload.material) {
      alert("Material is required for Antique Furniture and Running Shoes.");
      return;
    }
    // Validate image URL
    try {
      new URL(payload.image);
    } catch (err) {
      alert("Please enter a valid image URL.");
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
      alert("Item added successfully");
      form.reset();
      setSelectedCategory(""); // Reset category selection
      // Refresh item list, if needed:
      const res2 = await fetch("/api/admin/item/list");
      const data2 = await res2.json();
      setItems(data2.items);
    } else {
      alert(data.error || "Error adding item");
    }
  };
  

  // 2. Remove Item
  const handleRemoveItem = async (itemId) => {
    if (!confirm("Are you sure you want to remove this item?")) return;
    const res = await fetch("/api/admin/item/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ itemId }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("Item removed successfully");
      // refresh item list
      const res2 = await fetch("/api/admin/item/list");
      const data2 = await res2.json();
      setItems(data2.items);
    } else {
      alert(data.error || "Error removing item");
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
      alert("User added successfully");
      form.reset();
      // refresh user list
      const res2 = await fetch("/api/admin/user/list");
      const data2 = await res2.json();
      setUsers(data2.users);
    } else {
      alert(data.error || "Error adding user");
    }
  };

  // 4. Remove User
  const handleRemoveUser = async (userId) => {
    if (!confirm("Are you sure you want to remove this user?")) return;
    const res = await fetch("/api/admin/user/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId }),
    });
    const data = await res.json();
    if (res.ok) {
      alert("User removed successfully");
      // refresh user list
      const res2 = await fetch("/api/admin/user/list");
      const data2 = await res2.json();
      setUsers(data2.users);
    } else {
      alert(data.error || "Error removing user");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Admin Page</h1>
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => setActiveTab("addItem")}>Add Item</button>
        <button onClick={() => setActiveTab("removeItem")}>Remove Item</button>
        <button onClick={() => setActiveTab("addUser")}>Add User</button>
        <button onClick={() => setActiveTab("removeUser")}>Remove User</button>
      </div>
      {activeTab === "addItem" && (
        <div>
          <h2>Add Item</h2>
          <form onSubmit={handleAddItem}>
            <div>
              <label>Name: </label>
              <input name="name" required />
            </div>
            <div>
              <label>Category: </label>
              <select
                name="category"
                required
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Select a category</option>
                <option value="Vinyls">Vinyls</option>
                <option value="Antique Furniture">Antique Furniture</option>
                <option value="GPS Sport Watches">GPS Sport Watches</option>
                <option value="Running Shoes">Running Shoes</option>
              </select>
            </div>
            <div>
              <label>Description: </label>
              <textarea name="description" required />
            </div>
            <div>
              <label>Price: </label>
              <input name="price" required />
            </div>
            <div>
              <label>Seller: </label>
              <input name="seller" required />
            </div>
            <div>
              <label>Image URL: </label>
              <input name="image" required placeholder="https://example.com/image.jpg" />
            </div>
            <div>
              <label>Battery Life: </label>
              <input
                name="battery_life"
                disabled={selectedCategory !== "GPS Sport Watches"}
                style={{
                  backgroundColor:
                    selectedCategory !== "GPS Sport Watches" ? "#eee" : "inherit",
                }}
              />
            </div>
            <div>
              <label>Age: </label>
              <input
                name="age"
                disabled={!(selectedCategory === "Vinyls" || selectedCategory === "Antique Furniture")}
                style={{
                  backgroundColor:
                    !(selectedCategory === "Vinyls" || selectedCategory === "Antique Furniture")
                      ? "#eee"
                      : "inherit",
                }}
              />
            </div>
            <div>
              <label>Size: </label>
              <input
                name="size"
                disabled={selectedCategory !== "Running Shoes"}
                style={{
                  backgroundColor: selectedCategory !== "Running Shoes" ? "#eee" : "inherit",
                }}
              />
            </div>
            <div>
              <label>Material: </label>
              <input
                name="material"
                disabled={!(selectedCategory === "Antique Furniture" || selectedCategory === "Running Shoes")}
                style={{
                  backgroundColor:
                    !(selectedCategory === "Antique Furniture" || selectedCategory === "Running Shoes")
                      ? "#eee"
                      : "inherit",
                }}
              />
            </div>
            <button type="submit">Add Item</button>
          </form>
        </div>
      )}

      {activeTab === "removeItem" && (
        <div>
          <h2>Remove Item</h2>
          {items.map((item) => (
            <div key={item._id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
              <img src={item.image} alt={item.name} style={{ width: "100px", height: "100px", objectFit: "cover" }} />
              <div>
                <strong>{item.name}</strong> - ${item.price}
              </div>
              <div>{item.description}</div>
              <button onClick={() => handleRemoveItem(item._id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
      {activeTab === "addUser" && (
        <div>
          <h2>Add User</h2>
          <form onSubmit={handleAddUser}>
            <div>
              <label>Username: </label>
              <input name="username" required />
            </div>
            <div>
              <label>Password: </label>
              <input name="password" type="password" required />
            </div>
            <div>
              <label>Admin: </label>
              <input name="isAdmin" type="checkbox" />
            </div>
            <button type="submit">Add User</button>
          </form>
        </div>
      )}
      {activeTab === "removeUser" && (
        <div>
          <h2>Remove User</h2>
          {users.map((u) => (
            <div key={u._id} style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1rem" }}>
              <div>
                <strong>{u.username}</strong> - {u.isAdmin ? "Admin" : "User"}
              </div>
              <div>
                <strong>Ratings:</strong> {JSON.stringify(u.ratings)}
              </div>
              <div>
                <strong>Reviews:</strong> {JSON.stringify(u.reviews)}
              </div>
              <button onClick={() => handleRemoveUser(u._id)}>Remove</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
