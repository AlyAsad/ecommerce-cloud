import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    // Await the params before destructuring
    const { id } = await params;
    // Extract search params from the request URL
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db("ecommerceDB");
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const userRating = user.ratings.find(r => r.itemId === id);
    return NextResponse.json({ userRating: userRating ? userRating.rating : 0 });
  } catch (error) {
    console.error("Error fetching user rating:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
