import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request, { params }) {
  try {
    const { id } = params; // item id
    const { rating, userId } = await request.json();

    if (rating === undefined || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const numericRating = Number(rating);
    const client = await clientPromise;
    const db = client.db("ecommerceDB");

    // Fetch the item document
    const item = await db.collection("items").findOne({ _id: new ObjectId(id) });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }

    // Fetch the user's document
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has already rated this item
    const existingUserRating = user.ratings.find(r => r.itemId === id);

    if (numericRating === 0) {
      // Remove rating if exists
      if (existingUserRating) {
        await db.collection("users").updateOne(
          { _id: new ObjectId(userId) },
          { $pull: { ratings: { itemId: id } } }
        );
        const totalRating = Number(item.rating) * Number(item.num_of_ratings);
        const newNumOfRatings = Number(item.num_of_ratings) - 1;
        const newAverage =
          newNumOfRatings > 0
            ? (totalRating - Number(existingUserRating.rating)) / newNumOfRatings
            : 0;
        await db.collection("items").updateOne(
          { _id: new ObjectId(id) },
          { $set: { rating: newAverage.toFixed(1), num_of_ratings: newNumOfRatings } }
        );
        return NextResponse.json({
          message: "Rating removed",
          newAverage: newAverage.toFixed(1),
          newNumOfRatings,
        });
      } else {
        return NextResponse.json({ message: "No existing rating to remove" });
      }
    } else {
      if (existingUserRating) {
        // Update existing rating.
        const totalRating = Number(item.rating) * Number(item.num_of_ratings);
        const newTotal = totalRating - Number(existingUserRating.rating) + numericRating;
        const newAverage = newTotal / Number(item.num_of_ratings);
        await db.collection("users").updateOne(
          { _id: new ObjectId(userId), "ratings.itemId": id },
          { $set: { "ratings.$.rating": numericRating } }
        );
        await db.collection("items").updateOne(
          { _id: new ObjectId(id) },
          { $set: { rating: newAverage.toFixed(1) } }
        );
        return NextResponse.json({
          message: "Rating updated",
          newAverage: newAverage.toFixed(1),
          newNumOfRatings: item.num_of_ratings,
        });
      } else {
        // New rating: increment number of raters.
        const totalRating = Number(item.rating) * Number(item.num_of_ratings);
        const newNumOfRatings = Number(item.num_of_ratings) + 1;
        const newAverage = (totalRating + numericRating) / newNumOfRatings;
        await db.collection("users").updateOne(
          { _id: new ObjectId(userId) },
          { $push: { ratings: { itemId: id, rating: numericRating } } }
        );
        await db.collection("items").updateOne(
          { _id: new ObjectId(id) },
          { $set: { rating: newAverage.toFixed(1), num_of_ratings: newNumOfRatings } }
        );
        return NextResponse.json({
          message: "Rating submitted",
          newAverage: newAverage.toFixed(1),
          newNumOfRatings,
        });
      }
    }
  } catch (error) {
    console.error("Rating submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
