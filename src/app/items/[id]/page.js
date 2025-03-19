import { ObjectId } from "mongodb";
import clientPromise from "../../../lib/mongodb";
import Link from "next/link";
import RatingForm from "../../../components/RatingForm";
import ReviewForm from "../../../components/ReviewForm";
import ReviewList from "../../../components/ReviewList";

export default async function ItemPage({ params }) {
  const { id } = await params;
  const client = await clientPromise;
  const db = client.db("ecommerceDB");

  let item;
  try {
    item = await db.collection("items").findOne({ _id: new ObjectId(id) });
  } catch (error) {
    console.error("Invalid ID format:", error);
    return <div>Invalid item ID.</div>;
  }

  if (!item) {
    return <div>Item not found.</div>;
  }

  return (
    <div style={{ padding: "2rem" }}>
      <Link href="/" style={{ marginBottom: "1rem", display: "inline-block" }}>
        ← Back to Home
      </Link>
      <div style={{ display: "flex", flexWrap: "wrap", gap: "2rem", marginBottom: "2rem" }}>
        {/* Item Image */}
        <div>
          <img 
            src={`/images/items/${item.image}`} 
            alt={item.name} 
            style={{ width: "300px", height: "300px", objectFit: "cover", borderRadius: "8px" }} 
          />
        </div>
        {/* Item Information */}
        <div style={{ flex: 1 }}>
          <h1>{item.name}</h1>
          <p><strong>Category:</strong> {item.category}</p>
          <p><strong>Price:</strong> ${item.price}</p>
          <p><strong>Seller:</strong> {item.seller}</p>
          <p>
            <strong>Rating:</strong> {item.rating ? item.rating : "N/A"} stars (
            {item.num_of_ratings ? item.num_of_ratings : "0"} ratings)
          </p>
          <p>{item.description}</p>
        </div>
      </div>

      <div style={{ marginBottom: "2rem" }}>
        <h2>Additional Information</h2>
        <ul>
          {item.battery_life && <li><strong>Battery Life:</strong> {item.battery_life}</li>}
          {item.age && <li><strong>Age:</strong> {item.age}</li>}
          {item.size && <li><strong>Size:</strong> {item.size}</li>}
          {item.material && <li><strong>Material:</strong> {item.material}</li>}
        </ul>
      </div>

      {/* Rating and Review Client Components */}
      <RatingForm itemId={item._id.toString()} />
      <ReviewForm itemId={item._id.toString()} />
      <ReviewList itemId={item._id.toString()} initialReviews={item.reviews || []} />
    </div>
  );
}
