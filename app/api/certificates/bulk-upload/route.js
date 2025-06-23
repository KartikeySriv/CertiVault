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

    const formData = await request.formData()
    const csvFile = formData.get("csvFile")

    if (!csvFile) {
      return NextResponse.json({ message: "No CSV file provided" }, { status: 400 })
    }

    const csvText = await csvFile.text()
    const lines = csvText.split("\n").filter((line) => line.trim())

    if (lines.length < 2) {
      return NextResponse.json({ message: "CSV file must contain at least a header and one data row" }, { status: 400 })
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

    const results = {
      total: 0,
      successful: 0,
      failed: 0,
      errors: [],
    }

    // Skip header row
    const dataLines = lines.slice(1)
    results.total = dataLines.length

    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i].trim()
      if (!line) continue

      try {
        const columns = line.split(",").map((col) => col.trim().replace(/^"|"$/g, ""))

        if (columns.length < 4) {
          results.failed++
          results.errors.push({
            row: i + 2,
            message: "Insufficient columns. Expected: Name, Certificate ID, Issue Date, Course/Program, Email",
          })
          continue
        }

        const [name, certificateId, issueDate, courseOrProgram, email] = columns

        if (!name || !certificateId || !issueDate || !courseOrProgram) {
          results.failed++
          results.errors.push({
            row: i + 2,
            message: "Missing required fields",
          })
          continue
        }

        // Check if certificate ID already exists
        const existingCert = await certificates.findOne({ certificateId })
        if (existingCert) {
          results.failed++
          results.errors.push({
            row: i + 2,
            message: `Certificate ID '${certificateId}' already exists`,
          })
          continue
        }

        // Validate date format
        const parsedDate = new Date(issueDate)
        if (isNaN(parsedDate.getTime())) {
          results.failed++
          results.errors.push({
            row: i + 2,
            message: "Invalid date format. Use YYYY-MM-DD",
          })
          continue
        }

        // Create certificate
        const certificate = {
          name,
          certificateId,
          issueDate: parsedDate,
          courseOrProgram,
          email: email || null,
          organization: user.organizationName,
          createdBy: decoded.userId,
          createdAt: new Date(),
        }

        await certificates.insertOne(certificate)
        results.successful++
      } catch (error) {
        results.failed++
        results.errors.push({
          row: i + 2,
          message: error.message,
        })
      }
    }

    return NextResponse.json(results)
  } catch (error) {
    console.error("Bulk upload error:", error)
    return NextResponse.json({ message: "Internal server error" }, { status: 500 })
  }
}
