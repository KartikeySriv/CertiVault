import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import clientPromise from "@/lib/mongodb"

export async function GET(request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    const client = await clientPromise
    const db = client.db("certivault")
    const certificates = db.collection("certificates")

    const recentCertificates = await certificates
      .find({ createdBy: decoded.userId })
      .sort({ createdAt: -1 })
      .limit(5)
      .toArray()

    return NextResponse.json(recentCertificates)
  } catch (error) {
    console.error("Recent certificates error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
