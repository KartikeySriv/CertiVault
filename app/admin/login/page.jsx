"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Shield, User, Mail, Lock, Building, ArrowLeft, Sparkles } from "lucide-react"
import Link from "next/link"
import axios from "axios"

export default function AdminAuth() {
  const [isLogin, setIsLogin] = useState(true)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  })

  const [signupData, setSignupData] = useState({
    organizationName: "",
    adminName: "",
    email: "",
    password: "",
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post("/api/auth/login", loginData)
      localStorage.setItem("token", response.data.token)
      router.push("/admin/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Login failed")
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const response = await axios.post("/api/auth/signup", signupData)
      localStorage.setItem("token", response.data.token)
      router.push("/admin/dashboard")
    } catch (err) {
      setError(err.response?.data?.message || "Signup failed")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-tr from-indigo-400/20 to-pink-600/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-cyan-400/10 to-blue-600/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <Shield className="h-12 w-12 text-blue-400 group-hover:text-blue-300 transition-colors" />
                <div className="absolute -top-1 -right-1 w-4 h-4 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full animate-pulse"></div>
              </div>
              <div className="text-left">
                <span className="text-3xl font-bold text-white group-hover:text-blue-100 transition-colors">
                  CertiVault
                </span>
                <p className="text-blue-300 text-sm">Admin Portal</p>
              </div>
            </Link>

            <div className="inline-flex items-center space-x-2 bg-blue-500/20 backdrop-blur-sm px-4 py-2 rounded-full border border-blue-400/30">
              <Sparkles className="h-4 w-4 text-blue-300" />
              <span className="text-sm font-medium text-blue-100">Secure Admin Access</span>
            </div>
          </div>

          <Card className="border-0 shadow-2xl bg-white/10 backdrop-blur-xl border border-white/20">
            <CardHeader className="pb-4">
              <div className="flex space-x-1 bg-white/10 p-1 rounded-xl backdrop-blur-sm">
                <button
                  onClick={() => setIsLogin(true)}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    isLogin
                      ? "bg-white text-blue-600 shadow-lg transform scale-105"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Sign In
                </button>
                <button
                  onClick={() => setIsLogin(false)}
                  className={`flex-1 py-3 px-4 rounded-lg text-sm font-semibold transition-all duration-200 ${
                    !isLogin
                      ? "bg-white text-blue-600 shadow-lg transform scale-105"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  Sign Up
                </button>
              </div>
            </CardHeader>

            <CardContent className="space-y-6">
              {error && (
                <div className="bg-red-500/20 border border-red-400/30 text-red-100 px-4 py-3 rounded-xl backdrop-blur-sm animate-in slide-in-from-top-2 duration-300">
                  {error}
                </div>
              )}

              {isLogin ? (
                <form onSubmit={handleLogin} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-white/90 font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-white/50" />
                      <Input
                        id="email"
                        type="email"
                        placeholder="admin@example.com"
                        className="h-14 pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 rounded-xl backdrop-blur-sm"
                        value={loginData.email}
                        onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-white/90 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-white/50" />
                      <Input
                        id="password"
                        type="password"
                        placeholder="Enter your password"
                        className="h-14 pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 rounded-xl backdrop-blur-sm"
                        value={loginData.password}
                        onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Signing in...</span>
                      </div>
                    ) : (
                      "Sign In to Dashboard"
                    )}
                  </Button>
                </form>
              ) : (
                <form onSubmit={handleSignup} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="organizationName" className="text-white/90 font-medium">
                      Organization Name
                    </Label>
                    <div className="relative">
                      <Building className="absolute left-4 top-4 h-5 w-5 text-white/50" />
                      <Input
                        id="organizationName"
                        placeholder="Your Organization"
                        className="h-14 pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 rounded-xl backdrop-blur-sm"
                        value={signupData.organizationName}
                        onChange={(e) => setSignupData({ ...signupData, organizationName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="adminName" className="text-white/90 font-medium">
                      Admin Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-4 top-4 h-5 w-5 text-white/50" />
                      <Input
                        id="adminName"
                        placeholder="Your Full Name"
                        className="h-14 pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 rounded-xl backdrop-blur-sm"
                        value={signupData.adminName}
                        onChange={(e) => setSignupData({ ...signupData, adminName: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupEmail" className="text-white/90 font-medium">
                      Email Address
                    </Label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-4 h-5 w-5 text-white/50" />
                      <Input
                        id="signupEmail"
                        type="email"
                        placeholder="admin@example.com"
                        className="h-14 pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 rounded-xl backdrop-blur-sm"
                        value={signupData.email}
                        onChange={(e) => setSignupData({ ...signupData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="signupPassword" className="text-white/90 font-medium">
                      Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-4 top-4 h-5 w-5 text-white/50" />
                      <Input
                        id="signupPassword"
                        type="password"
                        placeholder="Create a secure password"
                        className="h-14 pl-12 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-blue-400 focus:ring-4 focus:ring-blue-400/20 rounded-xl backdrop-blur-sm"
                        value={signupData.password}
                        onChange={(e) => setSignupData({ ...signupData, password: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <Button
                    type="submit"
                    className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
                    disabled={loading}
                  >
                    {loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Creating Account...</span>
                      </div>
                    ) : (
                      "Create Admin Account"
                    )}
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>

          <div className="text-center mt-8">
            <Link
              href="/"
              className="inline-flex items-center space-x-2 text-blue-300 hover:text-blue-200 transition-colors group"
            >
              <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
              <span className="font-medium">Back to Certificate Verification</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
