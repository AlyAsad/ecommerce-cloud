import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import Link from "next/link";
import InteractiveRating from "../../../components/InteractiveRating";
import ReviewSection from "../../../components/ReviewSection";
import { Container, Box, Typography, Grid, Button } from "@mui/material";

export default async function ItemPage({ params }) {
  const { id } = params;
  const client = await clientPromise;
  const db = client.db("ecommerceDB");

  let item;
  try {
    item = await db.collection("items").findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error("Invalid ID format:", error);
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          Invalid item ID.
        </Typography>
      </Container>
    );
  }

  if (!item) {
    return (
      <Container sx={{ py: 4 }}>
        <Typography variant="h6" color="error">
          Item not found.
        </Typography>
      </Container>
    );
  }

  return (
    <Container sx={{ py: 4 }}>
      <Link href="/" passHref>
        <Button variant="outlined" sx={{ mb: 2 }}>
          ← Back to Home
        </Button>
      </Link>
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Box
            component="img"
            src={item.image}
            alt={item.name}
            sx={{ width: "100%", height: "auto", objectFit: "cover", borderRadius: 2 }}
          />
        </Grid>
        <Grid item xs={12} md={8}>
          <Typography variant="h4" component="h1" gutterBottom>
            {item.name}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Category:</strong> {item.category}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Price:</strong> ${item.price}
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Seller:</strong> {item.seller}
          </Typography>
          <InteractiveRating
            itemId={item._id.toString()}
            initialRating={item.rating || "0"}
            initialNumRatings={item.num_of_ratings || 0}
          />
          <Typography variant="body2" sx={{ mt: 2 }}>
            {item.description}
          </Typography>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Additional Information
        </Typography>
        <Box component="ul" sx={{ pl: 2 }}>
          {item.battery_life && (
            <li>
              <Typography variant="body1">
                <strong>Battery Life:</strong> {item.battery_life}
              </Typography>
            </li>
          )}
          {item.age && (
            <li>
              <Typography variant="body1">
                <strong>Age:</strong> {item.age}
              </Typography>
            </li>
          )}
          {item.size && (
            <li>
              <Typography variant="body1">
                <strong>Size:</strong> {item.size}
              </Typography>
            </li>
          )}
          {item.material && (
            <li>
              <Typography variant="body1">
                <strong>Material:</strong> {item.material}
              </Typography>
            </li>
          )}
        </Box>
      </Box>

      <ReviewSection itemId={item._id.toString()} initialReviews={item.reviews || []} />
    </Container>
  );
}
