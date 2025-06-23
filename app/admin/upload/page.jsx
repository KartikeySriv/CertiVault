"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Shield, Upload, ArrowLeft, CheckCircle, XCircle, User, Hash, Calendar, BookOpen, Mail } from "lucide-react"
import Link from "next/link"
import axios from "axios"

export default function ManualUpload() {
  const [formData, setFormData] = useState({
    name: "",
    certificateId: "",
    issueDate: "",
    courseOrProgram: "",
    email: "",
  })
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/admin/login")
    }
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: "", text: "" })

    try {
      const token = localStorage.getItem("token")
      const config = { headers: { Authorization: `Bearer ${token}` } }

      await axios.post("/api/certificates/create", formData, config)

      setMessage({
        type: "success",
        text: "Certificate uploaded successfully!",
      })

      // Reset form
      setFormData({
        name: "",
        certificateId: "",
        issueDate: "",
        courseOrProgram: "",
        email: "",
      })
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to upload certificate",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <Link href="/" className="flex items-center space-x-3 group">
                <div className="relative">
                  <Shield className="h-10 w-10 text-blue-600 group-hover:text-blue-700 transition-colors" />
                  <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
                </div>
                <div>
                  <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    CertiVault
                  </span>
                  <p className="text-sm text-gray-500 font-medium">Manual Upload</p>
                </div>
              </Link>
            </div>

            <Link href="/admin/dashboard">
              <Button
                variant="outline"
                className="flex items-center space-x-2 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Dashboard</span>
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
            <Upload className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Certificate Upload</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload New Certificate</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Add a new certificate manually with detailed information and custom fields
          </p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl">
                <Upload className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Certificate Details
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className="p-8">
            {message.text && (
              <div
                className={`flex items-center space-x-3 p-4 rounded-xl mb-8 animate-in slide-in-from-top-2 duration-300 ${
                  message.type === "success"
                    ? "bg-green-50 text-green-700 border border-green-200"
                    : "bg-red-50 text-red-700 border border-red-200"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="h-6 w-6 flex-shrink-0" />
                ) : (
                  <XCircle className="h-6 w-6 flex-shrink-0" />
                )}
                <span className="font-medium">{message.text}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-gray-700 font-semibold flex items-center space-x-2">
                    <User className="h-4 w-4" />
                    <span>Recipient Name *</span>
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    placeholder="Enter recipient's full name"
                    value={formData.name}
                    onChange={handleChange}
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="certificateId" className="text-gray-700 font-semibold flex items-center space-x-2">
                    <Hash className="h-4 w-4" />
                    <span>Certificate ID *</span>
                  </Label>
                  <Input
                    id="certificateId"
                    name="certificateId"
                    placeholder="e.g., CERT-2024-001"
                    value={formData.certificateId}
                    onChange={handleChange}
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                    required
                  />
                  <p className="text-sm text-gray-500 mt-1 flex items-center space-x-1">
                    <span>Must be unique. This will be used for verification.</span>
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label htmlFor="issueDate" className="text-gray-700 font-semibold flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <span>Issue Date *</span>
                  </Label>
                  <Input
                    id="issueDate"
                    name="issueDate"
                    type="date"
                    value={formData.issueDate}
                    onChange={handleChange}
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="courseOrProgram" className="text-gray-700 font-semibold flex items-center space-x-2">
                    <BookOpen className="h-4 w-4" />
                    <span>Course/Program *</span>
                  </Label>
                  <Input
                    id="courseOrProgram"
                    name="courseOrProgram"
                    placeholder="e.g., Web Development Bootcamp"
                    value={formData.courseOrProgram}
                    onChange={handleChange}
                    className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-semibold flex items-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span>Email (Optional)</span>
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="recipient@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="h-12 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                />
                <p className="text-sm text-gray-500 mt-1">Optional email address for the certificate recipient</p>
              </div>

              <div className="flex space-x-4 pt-6">
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                >
                  {loading ? (
                    <div className="flex items-center space-x-2">
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Uploading Certificate...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2">
                      <Upload className="h-5 w-5" />
                      <span>Upload Certificate</span>
                    </div>
                  )}
                </Button>

                <Link href="/admin/dashboard">
                  <Button
                    type="button"
                    variant="outline"
                    className="h-14 px-8 border-2 border-gray-200 hover:border-gray-300 hover:bg-gray-50 rounded-xl transition-all duration-200"
                  >
                    Cancel
                  </Button>
                </Link>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
