"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Shield,
  Upload,
  FileSpreadsheet,
  LogOut,
  Award,
  Calendar,
  TrendingUp,
  Users,
  BarChart3,
  Plus,
} from "lucide-react"
import Link from "next/link"
import axios from "axios"

export default function AdminDashboard() {
  const [user, setUser] = useState(null)
  const [stats, setStats] = useState({ totalCertificates: 0 })
  const [recentCertificates, setRecentCertificates] = useState([])
  const [loading, setLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = localStorage.getItem("token")
    if (!token) {
      router.push("/admin/login")
      return
    }

    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const token = localStorage.getItem("token")
      const config = { headers: { Authorization: `Bearer ${token}` } }

      const [userResponse, statsResponse, certificatesResponse] = await Promise.all([
        axios.get("/api/auth/me", config),
        axios.get("/api/certificates/stats", config),
        axios.get("/api/certificates/recent", config),
      ])

      setUser(userResponse.data)
      setStats(statsResponse.data)
      setRecentCertificates(certificatesResponse.data)
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      if (error.response?.status === 401) {
        localStorage.removeItem("token")
        router.push("/admin/login")
      }
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token")
    router.push("/")
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your dashboard...</p>
        </div>
      </div>
    )
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
                  <p className="text-sm text-gray-500 font-medium">Admin Dashboard</p>
                </div>
              </Link>

              <div className="hidden md:flex items-center space-x-2 bg-blue-50 px-3 py-1 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-blue-700">Live</span>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="hidden md:block text-right">
                <p className="text-sm text-gray-500">Welcome back,</p>
                <p className="font-semibold text-gray-900">{user?.adminName}</p>
              </div>
              <Button
                onClick={handleLogout}
                variant="outline"
                className="flex items-center space-x-2 hover:bg-red-50 hover:border-red-200 hover:text-red-600 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-12">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full translate-y-12 -translate-x-12"></div>

            <div className="relative z-10">
              <h1 className="text-4xl font-bold mb-2">Welcome back, {user?.adminName}! 👋</h1>
              <p className="text-blue-100 text-lg">
                Managing certificates for <span className="font-semibold">{user?.organizationName}</span>
              </p>

              <div className="flex items-center space-x-6 mt-6">
                <div className="flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5" />
                  <span className="text-sm">Dashboard Analytics</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span className="text-sm">Certificate Management</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-50 to-blue-100 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-blue-600 uppercase tracking-wider">Total Certificates</p>
                  <p className="text-4xl font-bold text-blue-900 mt-2">{stats.totalCertificates}</p>
                  <p className="text-sm text-blue-600 mt-1">All time</p>
                </div>
                <div className="p-4 bg-blue-500 rounded-2xl">
                  <Award className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-50 to-green-100 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-green-600 uppercase tracking-wider">This Month</p>
                  <p className="text-4xl font-bold text-green-900 mt-2">{stats.thisMonth || 0}</p>
                  <p className="text-sm text-green-600 mt-1">New certificates</p>
                </div>
                <div className="p-4 bg-green-500 rounded-2xl">
                  <Calendar className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-50 to-purple-100 hover:shadow-xl transition-all duration-200 transform hover:-translate-y-1">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-purple-600 uppercase tracking-wider">Organization</p>
                  <p className="text-xl font-bold text-purple-900 mt-2 truncate">{user?.organizationName}</p>
                  <p className="text-sm text-purple-600 mt-1">Active status</p>
                </div>
                <div className="p-4 bg-purple-500 rounded-2xl">
                  <Shield className="h-8 w-8 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Link href="/admin/upload">
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group bg-gradient-to-br from-white to-blue-50">
              <CardContent className="p-8">
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                    <Upload className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                      Manual Upload
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Add individual certificates with detailed information and custom fields
                    </p>
                    <div className="flex items-center space-x-2 mt-3 text-blue-600">
                      <Plus className="h-4 w-4" />
                      <span className="text-sm font-medium">Start uploading</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>

          <Link href="/admin/bulk-upload">
            <Card className="border-0 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 cursor-pointer group bg-gradient-to-br from-white to-green-50">
              <CardContent className="p-8">
                <div className="flex items-center space-x-6">
                  <div className="p-4 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl group-hover:scale-110 transition-transform duration-200">
                    <FileSpreadsheet className="h-10 w-10 text-white" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-2xl font-bold text-gray-900 mb-2 group-hover:text-green-600 transition-colors">
                      Bulk Upload
                    </h3>
                    <p className="text-gray-600 leading-relaxed">
                      Upload multiple certificates at once using CSV files for efficiency
                    </p>
                    <div className="flex items-center space-x-2 mt-3 text-green-600">
                      <BarChart3 className="h-4 w-4" />
                      <span className="text-sm font-medium">Bulk processing</span>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Link>
        </div>

        {/* Recent Certificates */}
        <Card className="border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <CardTitle className="flex items-center space-x-3 text-xl">
              <div className="p-2 bg-gradient-to-r from-gray-600 to-gray-700 rounded-lg">
                <Award className="h-5 w-5 text-white" />
              </div>
              <span>Recent Certificates</span>
              <div className="ml-auto bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-medium">
                Latest {recentCertificates.length}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {recentCertificates.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Recipient</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Certificate ID</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Course/Program</th>
                      <th className="text-left py-4 px-6 font-semibold text-gray-700">Issue Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentCertificates.map((cert, index) => (
                      <tr
                        key={cert._id}
                        className={`border-b hover:bg-blue-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-gray-50/50"}`}
                      >
                        <td className="py-4 px-6">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-semibold text-sm">
                                {cert.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="font-semibold text-gray-900">{cert.name}</span>
                          </div>
                        </td>
                        <td className="py-4 px-6">
                          <span className="font-mono text-sm bg-gray-100 px-2 py-1 rounded">{cert.certificateId}</span>
                        </td>
                        <td className="py-4 px-6 text-gray-700">{cert.courseOrProgram}</td>
                        <td className="py-4 px-6 text-gray-600">
                          {new Date(cert.issueDate).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 bg-gradient-to-r from-gray-200 to-gray-300 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">No certificates yet</h3>
                <p className="text-gray-600 mb-6">Start by uploading your first certificate to see it here</p>
                <Link href="/admin/upload">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2 rounded-xl">
                    Upload Certificate
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
