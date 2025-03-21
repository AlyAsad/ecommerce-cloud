"use client";

import { useState } from "react";
import Link from "next/link";
import { Box, Grid, Card, CardMedia, CardContent, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";

export default function BrowseSection({ items, categories }) {
  const [selectedCategory, setSelectedCategory] = useState("all");

  const filteredItems = selectedCategory === "all" 
    ? items 
    : items.filter((item) => item.category === selectedCategory);

  return (
    <Box component="section" id="browse-section" sx={{ py: 4, bgcolor: "background.default" }}>
      {/* Category Buttons */}
      <Box sx={{ textAlign: "center", mb: 3 }}>
        {categories.map((cat) => (
          <Button 
            key={cat.value}
            onClick={() => setSelectedCategory(cat.value)}
            variant={selectedCategory === cat.value ? "contained" : "outlined"}
            sx={{ mx: 1 }}
          >
            {cat.label}
          </Button>
        ))}
      </Box>
      
      {/* Items Grid */}
      <Grid container spacing={3} justifyContent="center">
        {filteredItems.map((item) => (
          <Grid item key={item._id} xs={12} sm={6} md={4} lg={3}>
            <Link href={`/items/${item._id}`} passHref style={{ textDecoration: "none", color: "inherit" }}>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Card sx={{ height: "100%" }}>
                  <CardMedia 
                    component="img"
                    image={item.image}
                    alt={item.name}
                    sx={{ height: 140, objectFit: "cover" }}
                  />
                  <CardContent>
                    <Typography variant="h6" component="div" gutterBottom>
                      {item.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      ${item.price}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      {item.rating ? Number(item.rating).toFixed(2) : "N/A"} stars ({item.num_of_ratings ? item.num_of_ratings : "0"} ratings)
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                      minHeight: "2.3em",
                      mt: 1,
                    }}>
                      {item.description}
                    </Typography>
                  </CardContent>
                </Card>
              </motion.div>
            </Link>
          </Grid>
        ))}
        {filteredItems.length === 0 && (
          <Grid item xs={12}>
            <Typography variant="h6" align="center">
              No items found in this category.
            </Typography>
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
