"use client";

import Link from "next/link";
import { Box, Typography, Button, Grid } from "@mui/material";
import { motion } from "framer-motion";

export default function HeroSection({ topImages }) {
  const handleBrowse = () => {
    const section = document.getElementById("browse-section");
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <Box 
      component="section"
      sx={{
        py: 6,
        textAlign: "center",
        bgcolor: "primary.main",
        color: "primary.contrastText",
        borderRadius: 2,
      }}
    >
      <Typography variant="h3" component="h1" gutterBottom>
        E-commerce
      </Typography>
      <Box sx={{ mt: 2 }}>
        <Link href="/about" passHref>
          <Button variant="contained" sx={{ mr: 2 }}>
            Learn More
          </Button>
        </Link>
        <Button variant="contained" onClick={handleBrowse}>
          Browse
        </Button>
      </Box>
      <Grid container spacing={2} justifyContent="center" sx={{ mt: 4 }}>
        {topImages.map((item, idx) => (
          <Grid item key={idx}>
            <Link href={`/items/${item._id}`} passHref>
              <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
                <Box
                  component="img"
                  src={item.image}
                  alt={item.name}
                  sx={{
                    width: 200,
                    height: 200,
                    objectFit: "cover",
                    borderRadius: 2,
                    cursor: "pointer",
                  }}
                />
              </motion.div>
            </Link>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
