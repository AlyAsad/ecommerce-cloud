import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request, { params }) {
  try {
    const { id } = await params;
    const client = await clientPromise;
    const db = client.db("ecommerceDB");
    const item = await db.collection("items").findOne({ _id: new ObjectId(id) });
    if (!item) {
      return NextResponse.json({ error: "Item not found" }, { status: 404 });
    }
    return NextResponse.json({ reviews: item.reviews || [] });
  } catch (error) {
    console.error("Error fetching reviews:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
