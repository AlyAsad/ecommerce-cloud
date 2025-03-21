import { NextResponse } from "next/server";
import clientPromise from "../../../../../lib/mongodb";
import bcrypt from "bcryptjs";

export async function POST(request) {
  try {
    const { username, password, isAdmin } = await request.json();
    const client = await clientPromise;
    const db = client.db("ecommerceDB");

    const existingUser = await db.collection("users").findOne({ username });
    if (existingUser) {
      return NextResponse.json({ error: "Username already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      username,
      password: hashedPassword,
      ratings: [],
      reviews: [],
      isAdmin: !!isAdmin,
    };

    const result = await db.collection("users").insertOne(newUser);
    return NextResponse.json({ message: "User added", userId: result.insertedId });
  } catch (error) {
    console.error("Error adding user:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
