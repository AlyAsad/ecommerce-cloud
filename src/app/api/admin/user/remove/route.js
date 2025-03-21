import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const { userId } = await request.json();
    const client = await clientPromise;
    const db = client.db("ecommerceDB");

    const userDoc = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!userDoc) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const username = userDoc.username;
    const userRatings = userDoc.ratings || [];

    await db.collection("users").deleteOne({ _id: new ObjectId(userId) });

    await db.collection("items").updateMany(
      {},
      { $pull: { reviews: { username: username } } }
    );

    for (const r of userRatings) {
      const itemId = r.itemId;
      const removedRating = Number(r.rating);
      
      const itemDoc = await db.collection("items").findOne({ _id: new ObjectId(itemId) });
      if (itemDoc) {
        const currentNum = Number(itemDoc.num_of_ratings);
        const currentAvg = Number(itemDoc.rating);
        const totalRating = currentAvg * currentNum;
        const newNum = currentNum - 1;
        let newAvg = 0;
        if (newNum > 0) {
          newAvg = ((totalRating - removedRating) / newNum).toFixed(1);
        }
        
        await db.collection("items").updateOne(
          { _id: new ObjectId(itemId) },
          {
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
