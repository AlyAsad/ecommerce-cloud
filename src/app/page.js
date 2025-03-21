import clientPromise from "../lib/mongodb";
import HeroSection from "../components/HeroSection";
import BrowseSection from "../components/BrowseSection";
import { Container } from "@mui/material";

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  const client = await clientPromise;
  const db = client.db("ecommerceDB");
  const itemsData = await db.collection("items").find({}).toArray();
  
  const items = itemsData.map((item) => ({ ...item, _id: item._id.toString() }));

  // i am randomly selecting 4 items for the top images
  const shuffledItems = [...items].sort(() => 0.5 - Math.random());
  const topImages = shuffledItems.slice(0, 4);

  const categories = [
    { label: "All items", value: "all" },
    { label: "Vinyls", value: "Vinyls" },
    { label: "Antique Furniture", value: "Antique Furniture" },
    { label: "GPS Sport Watches", value: "GPS Sport Watches" },
    { label: "Running Shoes", value: "Running Shoes" },
  ];

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <HeroSection topImages={topImages} />
      <BrowseSection items={items} categories={categories} />
    </Container>
  );
}
