import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

// Helper function to format the date as "23-Aug-2022"
const formatDate = (date) => {
  const d = new Date(date);
  const day = d.getDate().toString().padStart(2, "0");
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  const month = monthNames[d.getMonth()];
  const year = d.getFullYear();
  return `${day}-${month}-${year}`;
};

export async function POST(request, { params }) {
  try {
    const { id } = await params;
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
      date: formatDate(new Date()),
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
