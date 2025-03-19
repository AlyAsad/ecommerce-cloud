import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(request, { params }) {
  try {
    const { id } = params; // item id
    const { review, userId } = await request.json();

    if (!review || !userId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db("ecommerceDB");

    // Fetch the user's document to get the username.
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const reviewDocument = {
      username: user.username,
      date: new Date().toLocaleDateString("en-US"),
      data: review,
    };

    // Append the review to the item document.
    await db.collection("items").updateOne(
      { _id: new ObjectId(id) },
      { $push: { reviews: reviewDocument } }
    );

    // Also update the user's document with the review.
    await db.collection("users").updateOne(
      { _id: new ObjectId(userId) },
      { $push: { reviews: { itemId: id, date: reviewDocument.date, review } } }
    );

    return NextResponse.json({ message: "Review submitted" });
  } catch (error) {
    console.error("Review submission error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
