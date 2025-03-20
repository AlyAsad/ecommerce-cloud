import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const { userId } = await request.json();
    const client = await clientPromise;
    const db = client.db("ecommerceDB");

    // Retrieve the user document to get the username and all ratings.
    const userDoc = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const username = userDoc.username;
    const userRatings = userDoc.ratings || [];

    // Delete the user document.
    await db.collection("users").deleteOne({ _id: new ObjectId(userId) });

    // Remove the user's reviews from all items (matching on username).
    await db.collection("items").updateMany(
      {},
      { $pull: { reviews: { username: username } } }
    );

    // Process each rating from the user's document.
    for (const r of userRatings) {
      const itemId = r.itemId;
      const removedRating = Number(r.rating);
      // Get the current item document.
      const itemDoc = await db.collection("items").findOne({ _id: new ObjectId(itemId) });
      if (itemDoc) {
        const currentNum = Number(itemDoc.num_of_ratings);
        const currentAvg = Number(itemDoc.rating);
        // Calculate the total rating before removal.
        const totalRating = currentAvg * currentNum;
        // New number of ratings is current minus one.
        const newNum = currentNum - 1;
        // Calculate the new average; if newNum is zero, set average to 0.
        let newAvg = 0;
        if (newNum > 0) {
          newAvg = ((totalRating - removedRating) / newNum).toFixed(1);
        }
        // Update the item document:
        await db.collection("items").updateOne(
          { _id: new ObjectId(itemId) },
          {
            // Remove the rating with matching userId from the ratings array.
            $pull: { ratings: { userId: userId } },
            $set: { rating: newAvg, num_of_ratings: newNum },
          }
        );
      }
    }

    return NextResponse.json({ message: "User removed" });
  } catch (error) {
    console.error("Error removing user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
