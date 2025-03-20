import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request) {
  try {
    const { itemId } = await request.json();
    const client = await clientPromise;
    const db = client.db("ecommerceDB");

    // Delete the item
    await db.collection("items").deleteOne({ _id: new ObjectId(itemId) });

    // Update all users: remove ratings and reviews for this item
    await db.collection("users").updateMany(
      {},
      {
        $pull: {
          ratings: { itemId: itemId },
          reviews: { itemId: itemId },
        },
      }
    );

    return NextResponse.json({ message: "Item removed" });
  } catch (error) {
    console.error("Error removing item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
