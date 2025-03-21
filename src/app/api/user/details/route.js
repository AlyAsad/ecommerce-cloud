import { NextResponse } from "next/server";
import clientPromise from "../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const userId = searchParams.get("userId");
  if (!userId) {
    return NextResponse.json({ error: "User ID is required" }, { status: 400 });
  }

  try {
    const client = await clientPromise;
    const db = client.db("ecommerceDB");

    const user = await db.collection("users").findOne({ userId }) || await db.collection("users").findOne({ _id: new ObjectId(userId) });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    let averageRating = 0;
    if (user.ratings && user.ratings.length > 0) {
      const total = user.ratings.reduce((sum, r) => sum + Number(r.rating), 0);
      averageRating = total / user.ratings.length;
    }

    return NextResponse.json({
      username: user.username,
      averageRating,
      ratings: user.ratings || [],
      reviews: user.reviews || []
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
