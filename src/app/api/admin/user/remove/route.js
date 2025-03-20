import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const { userId } = await request.json();
    const client = await clientPromise;
    const db = client.db("ecommerceDB");

    // Delete the user document
    await db.collection("users").deleteOne({ _id: new ObjectId(userId) });

    // For each item, remove rating entries from this user.
    // A robust solution would recalculate the average rating of affected items.
    // For simplicity, we update all items by pulling any ratings with this user.
    await db.collection("items").updateMany(
      {},
      { $pull: { ratings: { userId: userId } } }
    );

    return NextResponse.json({ message: "User removed" });
  } catch (error) {
    console.error("Error removing user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
