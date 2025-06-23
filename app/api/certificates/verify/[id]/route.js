import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"

export async function GET(request, { params }) {
  try {
    const { id } = params

    const client = await clientPromise
    const db = client.db("certivault")
    const certificates = db.collection("certificates")

    const certificate = await certificates.findOne({ certificateId: id })

    if (!certificate) {
      return NextResponse.json({ message: "Certificate not found" }, { status: 404 })
    }

    return NextResponse.json(certificate)
  } catch (error) {
    console.error("Certificate verification error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}