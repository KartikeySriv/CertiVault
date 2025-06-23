"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Shield,
  FileSpreadsheet,
  ArrowLeft,
  Upload,
  Download,
  CheckCircle,
  XCircle,
  AlertCircle,
  BarChart3,
} from "lucide-react"
import Link from "next/link"
import axios from "axios"

export default function BulkUpload() {
  const [file, setFile] = useState(null)
  const [loading, setLoading] = useState(false)
  const [results, setResults] = useState(null)
  const [message, setMessage] = useState({ type: "", text: "" })
  const [dragActive, setDragActive] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/admin/login")
    }
  }, [])

  const handleFileChange = (selectedFile) => {
    if (selectedFile && selectedFile.type === "text/csv") {
      setFile(selectedFile)
      setMessage({ type: "", text: "" })
      setResults(null)
    } else {
      setMessage({ type: "error", text: "Please select a valid CSV file" })
      setFile(null)
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0])
    }
  }

  const handleUpload = async () => {
    if (!file) {
      setMessage({ type: "error", text: "Please select a CSV file first" })
      return
    }

    setLoading(true)
    setMessage({ type: "", text: "" })
    setResults(null)

    try {
      const token = localStorage.getItem("token")
      const formData = new FormData()
      formData.append("csvFile", file)

      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      }

      const response = await axios.post("/api/certificates/bulk-upload", formData, config)
      setResults(response.data)

      if (response.data.successful > 0) {
        setMessage({
          type: "success",
          text: `Successfully uploaded ${response.data.successful} certificates!`,
        })
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to upload CSV file",
      })
    } finally {
      setLoading(false)
    }
  }

  const downloadTemplate = () => {
    const csvContent =
      "Name,Certificate ID,Issue Date,Course/Program,Email\nJohn Doe,CERT-2024-001,2024-01-15,Web Development,john@example.com\nJane Smith,CERT-2024-002,2024-01-16,Data Science,jane@example.com"
    const blob = new Blob([csvContent], { type: "text/csv" })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = "certificate_template.csv"
    a.click()
    window.URL.revokeObjectURL(url)
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
                  <p className="text-sm text-gray-500 font-medium">Bulk Upload</p>
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

      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-green-100 to-blue-100 px-4 py-2 rounded-full mb-6">
            <FileSpreadsheet className="h-4 w-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">Bulk Certificate Upload</span>
          </div>

          <h1 className="text-4xl font-bold text-gray-900 mb-4">Upload Multiple Certificates</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Upload hundreds of certificates at once using CSV files for maximum efficiency and time savings
          </p>
        </div>

        {/* Instructions Card */}
        <Card className="border-0 shadow-lg mb-8 bg-gradient-to-br from-blue-50 to-indigo-50">
          <CardHeader className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 border-b border-blue-200/50">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-lg">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <span className="text-gray-800">CSV Format Requirements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-8">
            <div className="space-y-6">
              <p className="text-gray-700 font-medium">
                Your CSV file should contain the following columns in this exact order:
              </p>

              <div className="bg-white/80 backdrop-blur-sm p-6 rounded-xl border border-blue-200/50">
                <code className="text-lg font-mono text-blue-700 font-semibold">
                  Name, Certificate ID, Issue Date, Course/Program, Email
                </code>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">1</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Name</p>
                      <p className="text-sm text-gray-600">Recipient's full name (required)</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">2</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Certificate ID</p>
                      <p className="text-sm text-gray-600">Unique identifier (required)</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">3</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Issue Date</p>
                      <p className="text-sm text-gray-600">Format: YYYY-MM-DD (required)</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">4</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Course/Program</p>
                      <p className="text-sm text-gray-600">Course or program name (required)</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-white text-xs font-bold">5</span>
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">Email</p>
                      <p className="text-sm text-gray-600">Recipient's email (optional)</p>
                    </div>
                  </div>
                </div>
              </div>

              <Button
                onClick={downloadTemplate}
                variant="outline"
                className="flex items-center space-x-2 bg-white hover:bg-blue-50 border-blue-200 hover:border-blue-300 text-blue-700 hover:text-blue-800 transition-colors"
              >
                <Download className="h-4 w-4" />
                <span>Download CSV Template</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Upload Section */}
        <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-lg mb-8">
          <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50 border-b">
            <CardTitle className="flex items-center space-x-3 text-2xl">
              <div className="p-3 bg-gradient-to-r from-green-500 to-blue-600 rounded-xl">
                <FileSpreadsheet className="h-6 w-6 text-white" />
              </div>
              <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                Upload CSV File
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

            <div className="space-y-6">
              {/* Drag and Drop Area */}
              <div
                className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all duration-200 ${
                  dragActive
                    ? "border-blue-400 bg-blue-50"
                    : file
                      ? "border-green-400 bg-green-50"
                      : "border-gray-300 hover:border-blue-400 hover:bg-blue-50/50"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  accept=".csv"
                  onChange={(e) => e.target.files[0] && handleFileChange(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />

                <div className="space-y-4">
                  <div
                    className={`w-20 h-20 mx-auto rounded-full flex items-center justify-center ${
                      file ? "bg-green-500" : "bg-gray-400"
                    }`}
                  >
                    <FileSpreadsheet className="h-10 w-10 text-white" />
                  </div>

                  {file ? (
                    <div>
                      <p className="text-lg font-semibold text-green-700">File Selected!</p>
                      <p className="text-green-600">{file.name}</p>
                      <p className="text-sm text-green-500">Size: {(file.size / 1024).toFixed(2)} KB</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-lg font-semibold text-gray-700">Drag and drop your CSV file here</p>
                      <p className="text-gray-500">or click to browse files</p>
                    </div>
                  )}
                </div>
              </div>

              <Button
                onClick={handleUpload}
                disabled={!file || loading}
                className="w-full h-14 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              >
                {loading ? (
                  <div className="flex items-center space-x-2">
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span>Processing CSV File...</span>
                  </div>
                ) : (
                  <div className="flex items-center space-x-2">
                    <Upload className="h-5 w-5" />
                    <span>Upload and Process CSV</span>
                  </div>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        {results && (
          <Card className="border-0 shadow-2xl animate-in slide-in-from-bottom-4 duration-500">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <CardTitle className="flex items-center space-x-3 text-xl">
                <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg">
                  <BarChart3 className="h-5 w-5 text-white" />
                </div>
                <span>Upload Results</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-2xl border border-green-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-green-600 uppercase tracking-wider">Successful</p>
                      <p className="text-4xl font-bold text-green-700 mt-2">{results.successful}</p>
                    </div>
                    <CheckCircle className="h-12 w-12 text-green-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-red-50 to-red-100 p-6 rounded-2xl border border-red-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-red-600 uppercase tracking-wider">Failed</p>
                      <p className="text-4xl font-bold text-red-700 mt-2">{results.failed}</p>
                    </div>
                    <XCircle className="h-12 w-12 text-red-500" />
                  </div>
                </div>

                <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-2xl border border-blue-200">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Total Processed</p>
                      <p className="text-4xl font-bold text-blue-700 mt-2">{results.total}</p>
                    </div>
                    <BarChart3 className="h-12 w-12 text-blue-500" />
                  </div>
                </div>
              </div>

              {results.errors && results.errors.length > 0 && (
                <div>
                  <h4 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
                    <XCircle className="h-5 w-5 text-red-500" />
                    <span>Errors Found ({results.errors.length})</span>
                  </h4>
                  <div className="space-y-3 max-h-64 overflow-y-auto">
                    {results.errors.map((error, index) => (
                      <div key={index} className="bg-red-50 border border-red-200 p-4 rounded-xl">
                        <p className="text-sm text-red-700">
                          <span className="font-semibold">Row {error.row}:</span> {error.message}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </main>
    </div>
  )
}
