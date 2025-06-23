"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Shield, CheckCircle, XCircle, Sparkles, Award, Users, Globe } from "lucide-react"
import Link from "next/link"
import axios from "axios"

export default function HomePage() {
  const [certificateId, setCertificateId] = useState("")
  const [certificate, setCertificate] = useState(null)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const verifyCertificate = async () => {
    if (!certificateId.trim()) {
      setError("Please enter a certificate ID")
      return
    }

    setLoading(true)
    setError("")
    setCertificate(null)

    try {
      const response = await axios.get(`/api/certificates/verify/${certificateId}`)
      setCertificate(response.data)
    } catch (err) {
      setError("Certificate not found.")
    } finally {
      setLoading(false)
    }
  }

  const handleKeyPress 
  = (e) => {
    if (e.key === "Enter") {
      verifyCertificate()
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      {/* Header */}
      <header className="relative z-10 bg-white/80 backdrop-blur-lg border-b border-white/20 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Shield className="h-10 w-10 text-blue-600" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full animate-pulse"></div>
              </div>
              <div>
                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CertiVault
                </h1>
                <p className="text-sm text-gray-500 font-medium">Secure • Trusted • Verified</p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <div className="flex items-center space-x-2 text-gray-600">
                <Users className="h-4 w-4" />
                <span className="text-sm font-medium">10,000+ Certificates</span>
              </div>
              <div className="flex items-center space-x-2 text-gray-600">
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">Global Verification</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-100 to-purple-100 px-4 py-2 rounded-full mb-6">
            <Sparkles className="h-4 w-4 text-blue-600" />
            <span className="text-sm font-semibold text-blue-700">Instant Certificate Verification</span>
          </div>

          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Verify Your
            <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Certificate
            </span>
          </h2>

          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Enter your unique Certificate ID below to instantly verify the authenticity and details of your certificate.
            Trusted by thousands of organizations worldwide.
          </p>
        </div>

        {/* Verification Form */}
        <div className="max-w-2xl mx-auto mb-12">
          <Card className="border-0 shadow-2xl bg-white/90 backdrop-blur-lg">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center justify-center space-x-3 text-xl">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <span className="bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                  Certificate Verification
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="relative">
                <div className="flex space-x-3">
                  <div className="relative flex-1">
                    <Input
                      placeholder="Enter Certificate ID (e.g., CERT-2024-001)"
                      value={certificateId}
                      onChange={(e) => setCertificateId(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="h-14 text-lg pl-4 pr-4 border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 rounded-xl transition-all duration-200"
                    />
                    {certificateId && (
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      </div>
                    )}
                  </div>
                  <Button
                    onClick={verifyCertificate}
                    disabled={loading}
                    className="h-14 px-8 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Verifying...</span>
                      </div>
                    ) : (
                      "Verify"
                    )}
                  </Button>
                </div>
              </div>

              {error && (
                <div className="flex items-center space-x-3 text-red-600 bg-red-50 border border-red-200 p-4 rounded-xl animate-in slide-in-from-top-2 duration-300">
                  <XCircle className="h-5 w-5 flex-shrink-0" />
                  <span className="font-medium">{error}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Certificate Display */}
        {certificate && (
          <div className="max-w-3xl mx-auto animate-in slide-in-from-bottom-4 duration-500">
            <Card className="border-0 shadow-2xl bg-gradient-to-br from-green-50 to-emerald-50 overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-green-400 via-blue-500 to-purple-600"></div>

              <CardHeader className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border-b border-green-200/50 pb-6">
                <CardTitle className="flex items-center space-x-3 text-2xl">
                  <div className="p-3 bg-gradient-to-r from-green-500 to-emerald-600 rounded-xl shadow-lg">
                    <CheckCircle className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <span className="bg-gradient-to-r from-green-700 to-emerald-700 bg-clip-text text-transparent font-bold">
                      Certificate Verified
                    </span>
                    <p className="text-sm text-green-600 font-normal mt-1">Authenticity confirmed</p>
                  </div>
                </CardTitle>
              </CardHeader>

              <CardContent className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-6">
                    <div className="group">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Recipient Name
                      </label>
                      <p className="text-2xl font-bold text-gray-900 mt-2 group-hover:text-blue-600 transition-colors">
                        {certificate.name}
                      </p>
                    </div>

                    <div className="group">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Certificate ID
                      </label>
                      <p className="text-lg font-mono font-semibold text-gray-900 mt-2 bg-gray-100 px-3 py-2 rounded-lg group-hover:bg-blue-50 transition-colors">
                        {certificate.certificateId}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="group">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                        Course/Program
                      </label>
                      <p className="text-xl font-bold text-gray-900 mt-2 group-hover:text-purple-600 transition-colors">
                        {certificate.courseOrProgram}
                      </p>
                    </div>

                    <div className="group">
                      <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Issue Date</label>
                      <p className="text-lg font-semibold text-gray-900 mt-2 group-hover:text-indigo-600 transition-colors">
                        {new Date(certificate.issueDate).toLocaleDateString("en-US", {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                </div>

                {certificate.organization && (
                  <div className="mt-8 pt-6 border-t border-green-200/50">
                    <div className="flex items-center space-x-3">
                      <Award className="h-6 w-6 text-green-600" />
                      <div>
                        <label className="text-sm font-semibold text-gray-500 uppercase tracking-wider">
                          Issued by
                        </label>
                        <p className="text-xl font-bold text-gray-900 mt-1">{certificate.organization}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Features Section */}
        {!certificate && (
          <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Secure Verification</h3>
              <p className="text-gray-600">
                Advanced encryption and blockchain technology ensure certificate authenticity
              </p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Sparkles className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Results</h3>
              <p className="text-gray-600">Get verification results in seconds with our lightning-fast system</p>
            </div>

            <div className="text-center group">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200">
                <Globe className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">Global Access</h3>
              <p className="text-gray-600">Access your certificates from anywhere in the world, anytime</p>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="relative z-10 bg-white/80 backdrop-blur-lg border-t border-white/20 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-6 md:mb-0">
              <Shield className="h-8 w-8 text-blue-600" />
              <div>
                <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  CertiVault
                </span>
                <p className="text-sm text-gray-500">Trusted Certificate Verification</p>
              </div>
            </div>

            <div className="flex items-center space-x-6">
              <div className="text-center">
                <p className="text-gray-600 mb-3">Are you an administrator?</p>
                <Link href="/admin/login">
                  <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold px-6 py-2 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105">
                    Admin Portal
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-8 border-t border-gray-200 text-center">
            <p className="text-gray-500">
              © 2024 CertiVault. All rights reserved. • Securing digital credentials worldwide.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
