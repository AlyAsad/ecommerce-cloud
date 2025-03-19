import clientPromise from "../lib/mongodb";
import HeroSection from "../components/HeroSection";
import BrowseSection from "../components/BrowseSection";

export default async function HomePage() {
  const client = await clientPromise;
  const db = client.db("ecommerceDB");
  const itemsData = await db.collection("items").find({}).toArray();
  // Serialize the MongoDB _id field to a string
  const items = itemsData.map((item) => ({ ...item, _id: item._id.toString() }));

  // Randomly select 4 items for the top images (hero section)
  const shuffledItems = [...items].sort(() => 0.5 - Math.random());
  const topImages = shuffledItems.slice(0, 4);

  // Define the categories
  const categories = [
    { label: "All items", value: "all" },
    { label: "Vinyls", value: "Vinyls" },
    { label: "Antique Furniture", value: "Antique Furniture" },
    { label: "GPS Sport Watches", value: "GPS Sport Watches" },
    { label: "Running Shoes", value: "Running Shoes" },
  ];

  return (
    <div>
      <HeroSection topImages={topImages} />
      <BrowseSection items={items} categories={categories} />
    </div>
  );
}
