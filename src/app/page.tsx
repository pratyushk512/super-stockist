"use client"

import { useState } from "react"
import { Eye, EyeOff, Lock, User } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Loader from "@/components/Loader"

export default function DualLoginPage() {
  const [showAdminPassword, setShowAdminPassword] = useState(false)
  const [showSalesPassword, setShowSalesPassword] = useState(false)
  const [adminEmail, setAdminEmail] = useState("")
  const [adminPassword, setAdminPassword] = useState("")
  const [salesEmail, setSalesEmail] = useState("")
  const [salesPassword, setSalesPassword] = useState("")
  const router=useRouter()
  const {toast}=useToast()
  const [isLoading, setIsLoading] = useState(false)
  const handleAdminLogin = () => {
    setIsLoading(true)
    console.log("Admin Login:", { adminEmail, adminPassword })
    const response= fetch("/api/users/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: adminEmail, password: adminPassword }),
    })
    response
      .then((res) => {
        if (res.ok) {
          router.push("/admin/dashboard")
          toast({
            title: "Login successful",
            description: "Welcome to the admin dashboard!",
            variant: "default",
          })
        } else {
          console.error("Login failed")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }
  
  const handleSalesLogin = () => {
    setIsLoading(true)
    console.log("Sales Login:", { salesEmail, salesPassword })
    const response= fetch("/api/users/sales-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email: salesEmail, password: salesPassword }),
    })
    response
      .then((res) => {
        if (res.ok) {
          router.push("/sales/home")
          toast({
            title: "Login successful",
            description: "Welcome to the sales portal!",
            variant: "default",
          })
        } else {
          console.error("Login failed")
        }
      })
      .catch((error) => {
        console.error("Error:", error)
      })
      .finally(() => {
        setIsLoading(false)
      })
  } 

  if(isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="loader">
          <Loader />
        </div>
      </div>
    )
  }
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <header className="container flex h-20 items-center justify-center py-6">
        <div className="flex items-center">
          <span className="text-xl font-semibold text-slate-800 dark:text-slate-200">J.N. Traders</span>
        </div>
      </header>
      <main className="container flex flex-1 items-center justify-center py-10">
        <div className="grid w-full max-w-5xl gap-6 lg:grid-cols-2">
          <div className="flex flex-col items-center justify-center">
            <Card className="w-full max-w-md border-slate-200 bg-white/50 shadow-md backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">Admin Login</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Enter your credentials to access the admin dashboard
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="admin-email" className="text-slate-700 dark:text-slate-300">
                    Email
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="admin-email"
                      type="email"
                      placeholder="admin@example.com"
                      className="pl-9 text-slate-900 dark:text-slate-100"
                      value={adminEmail}
                      onChange={(e) => setAdminEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="admin-password" className="text-slate-700 dark:text-slate-300">
                      Password
                    </Label>
                    <Link
                      href="#"
                      className="text-xs text-slate-500 underline-offset-4 hover:underline dark:text-slate-400"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="admin-password"
                      type={showAdminPassword ? "text" : "password"}
                      className="pl-9 pr-9 text-slate-900 dark:text-slate-100"
                      value={adminPassword}
                      onChange={(e) => setAdminPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowAdminPassword(!showAdminPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showAdminPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showAdminPassword ? "Hide password" : "Show password"}</span>
                    </button>
                  </div>
                </div>
                <Button className="w-full bg-slate-800 text-white hover:bg-slate-700 dark:bg-slate-700 dark:hover:bg-slate-600"
                onClick={handleAdminLogin}
                >
                  Sign in to Admin
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-300 dark:border-slate-700" />
                  </div>
                  <span className="relative bg-white/50 px-2 text-xs text-slate-500 backdrop-blur-sm dark:bg-slate-950/50 dark:text-slate-400">
                    Admin access only
                  </span>
                </div>
              </CardFooter>
            </Card>
          </div>
          <div className="flex flex-col items-center justify-center">
            <Card className="w-full max-w-md border-slate-200 bg-white/50 shadow-md backdrop-blur-sm dark:border-slate-800 dark:bg-slate-950/50">
              <CardHeader className="space-y-1 text-center">
                <CardTitle className="text-2xl font-bold text-slate-900 dark:text-slate-100">Sales Login</CardTitle>
                <CardDescription className="text-slate-500 dark:text-slate-400">
                  Enter your credentials to access the sales portal
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="sales-email" className="text-slate-700 dark:text-slate-300">
                    Email
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="sales-email"
                      type="email"
                      placeholder="sales@example.com"
                      className="pl-9 text-slate-900 dark:text-slate-100"
                      value={salesEmail}
                      onChange={(e) => setSalesEmail(e.target.value)}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="sales-password" className="text-slate-700 dark:text-slate-300">
                      Password
                    </Label>
                    <Link
                      href="#"
                      className="text-xs text-slate-500 underline-offset-4 hover:underline dark:text-slate-400"
                    >
                      Forgot password?
                    </Link>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <Input
                      id="sales-password"
                      type={showSalesPassword ? "text" : "password"}
                      className="pl-9 pr-9 text-slate-900 dark:text-slate-100"
                      value={salesPassword}
                      onChange={(e) => setSalesPassword(e.target.value)}
                    />
                    <button
                      type="button"
                      onClick={() => setShowSalesPassword(!showSalesPassword)}
                      className="absolute right-3 top-3 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    >
                      {showSalesPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      <span className="sr-only">{showSalesPassword ? "Hide password" : "Show password"}</span>
                    </button>
                  </div>
                </div>
                <Button className="w-full bg-emerald-600 text-white hover:bg-emerald-700 dark:bg-emerald-700 dark:hover:bg-emerald-600"
                onClick={handleSalesLogin}
                >
                  Sign in to Sales
                </Button>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-300 dark:border-slate-700" />
                  </div>
                  <span className="relative bg-white/50 px-2 text-xs text-slate-500 backdrop-blur-sm dark:bg-slate-950/50 dark:text-slate-400">
                    Sales team access
                  </span>
                </div>
              </CardFooter>
            </Card>
          </div>
        </div>
      </main>
      <footer className="container py-6 text-center text-sm text-slate-500 dark:text-slate-400">
        © {new Date().getFullYear()} J.N. Traders. All rights reserved.
      </footer>
    </div>
  )
}
