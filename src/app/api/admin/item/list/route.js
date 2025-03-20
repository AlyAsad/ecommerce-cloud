import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("ecommerceDB");
    const items = await db.collection("items").find({}).toArray();
    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error listing items:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
