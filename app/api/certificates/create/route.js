import { NextResponse } from "next/server"
import jwt from "jsonwebtoken"
import { ObjectId } from "mongodb"
import clientPromise from "@/lib/mongodb"

export async function POST(request) {
  try {
    const authHeader = request.headers.get("authorization")
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "No token provided" }, { status: 401 })
    }

    const token = authHeader.substring(7)
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    const { name, certificateId, issueDate, courseOrProgram, email } = await request.json()

    if (!name || !certificateId || !issueDate || !courseOrProgram) {
      return NextResponse.json({ message: "All required fields must be provided" }, { status: 400 })
    }

    const client = await clientPromise
    const db = client.db("certivault")
    const certificates = db.collection("certificates")
    const users = db.collection("users")

    // Get user info
    const user = await users.findOne({ _id: new ObjectId(decoded.userId) })
    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 })
    }

    // Check if certificate ID already exists
    const existingCert = await certificates.findOne({ certificateId })
    if (existingCert) {
      return NextResponse.json({ message: "Certificate ID already exists" }, { status: 400 })
    }

    // Create certificate
    const certificate = {
      name,
      certificateId,
      issueDate: new Date(issueDate),
      courseOrProgram,
      email: email || null,
      organization: user.organizationName,
      createdBy: decoded.userId,
      createdAt: new Date(),
    }

    const result = await certificates.insertOne(certificate)

    return NextResponse.json({
      message: "Certificate created successfully",
      certificateId: result.insertedId,
    })
  } catch (error) {
    console.error("Certificate creation error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
