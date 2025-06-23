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

    // Get total certificates for this user
    const totalCertificates = await certificates.countDocuments({
      createdBy: decoded.userId,
    })

    // Get this month's certificates
    const startOfMonth = new Date()
    startOfMonth.setDate(1)
    startOfMonth.setHours(0, 0, 0, 0)

    const thisMonth = await certificates.countDocuments({
      createdBy: decoded.userId,
      createdAt: { $gte: startOfMonth },
    })

    return NextResponse.json({
      totalCertificates,
      thisMonth,
    })
  } catch (error) {
    console.error("Stats error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
