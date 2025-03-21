import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request, { params }) {
  try {
    const { id } = await params; // item id
    const { rating, userId } = await request.json();

    if (rating === undefined || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const numericRating = Number(rating);
    const client = await clientPromise;
    const db = client.db("ecommerceDB");

    // Fetch the latest item document
    let item = await db.collection("items").findOne({ _id: new ObjectId(id) });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    
    // Fetch the user's document freshly
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has already rated this item (using fresh user doc)
    const existingUserRating = user.ratings.find(r => r.itemId === id);

    // --- Removal ---
    if (numericRating === 0) {
      if (existingUserRating) {
        // Remove the rating from the user's document.
        await db.collection("users").updateOne(
          { _id: new ObjectId(userId) },
          { $pull: { ratings: { itemId: id } } }
        );
        const totalRating = Number(item.rating) * Number(item.num_of_ratings);
        const newNumOfRatings = Number(item.num_of_ratings) - 1;
        const newTotal = totalRating - Number(existingUserRating.rating);
        const newAverage = newNumOfRatings > 0 ? newTotal / newNumOfRatings : 0;
        await db.collection("items").updateOne(
          { _id: new ObjectId(id) },
          { $set: { rating: newAverage, num_of_ratings: newNumOfRatings } }
        );
        // Re-read updated item
        const updatedItem = await db.collection("items").findOne({ _id: new ObjectId(id) });
        return NextResponse.json({
          message: "Rating removed",
          newAverage: Number(updatedItem.rating).toFixed(2),
          newNumOfRatings: updatedItem.num_of_ratings,
        });
      } else {
        return NextResponse.json({ message: "No existing rating to remove" });
      }
    }
    // --- Update existing rating ---
    else if (existingUserRating) {
      const oldRating = Number(existingUserRating.rating);
      const totalRating = Number(item.rating) * Number(item.num_of_ratings);
      const newTotal = totalRating - oldRating + numericRating;
      const newAverage = newTotal / Number(item.num_of_ratings);
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId), "ratings.itemId": id },
        { $set: { "ratings.$.rating": numericRating } }
      );
      await db.collection("items").updateOne(
        { _id: new ObjectId(id) },
        { $set: { rating: newAverage } }
      );
      const updatedItem = await db.collection("items").findOne({ _id: new ObjectId(id) });
      return NextResponse.json({
        message: "Rating updated",
        newAverage: Number(updatedItem.rating).toFixed(2),
        newNumOfRatings: updatedItem.num_of_ratings,
      });
    }
    // --- New rating ---
    else {
      const totalRating = Number(item.rating) * Number(item.num_of_ratings);
      const newNumOfRatings = Number(item.num_of_ratings) + 1;
      const newTotal = totalRating + numericRating;
      const newAverage = newTotal / newNumOfRatings;
      await db.collection("users").updateOne(
        { _id: new ObjectId(userId) },
        { $push: { ratings: { itemId: id, rating: numericRating } } }
      );
      await db.collection("items").updateOne(
        { _id: new ObjectId(id) },
        { $set: { rating: newAverage, num_of_ratings: newNumOfRatings } }
      );
      const updatedItem = await db.collection("items").findOne({ _id: new ObjectId(id) });
      return NextResponse.json({
        message: "Rating submitted",
        newAverage: Number(updatedItem.rating).toFixed(2),
        newNumOfRatings: updatedItem.num_of_ratings,
      });
    }
  } catch (error) {
    console.error("Rating submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
