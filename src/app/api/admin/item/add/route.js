import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";

export async function POST(request) {
  try {
    const itemData = await request.json();
    const client = await clientPromise;
    const db = client.db("ecommerceDB");

    // Set default rating values
    itemData.rating = "0";
    itemData.num_of_ratings = 0;
    itemData.reviews = [];

    const result = await db.collection("items").insertOne(itemData);
    return NextResponse.json({ message: "Item added", itemId: result.insertedId });
  } catch (error) {
    console.error("Error adding item:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
