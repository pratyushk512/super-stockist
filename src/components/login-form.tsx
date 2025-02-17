'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
interface LoginFormProps {
  apiURL: string;
  className?: string;
  [key: string]: any;
}

export function LoginForm({ apiURL, className, ...props }: LoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast()
  const router = useRouter()
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log(email, password)
    try {
      const response = await fetch(apiURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (response.ok) {
        toast({
          title: "Login Successful",
        })
        if(apiURL=="/api/users/sales-login"){
          router.push("sales/home")
        }
        else{
          router.push("/admin/dashboard")
        }
      }
      else {
        toast({
          title: "Login Failed",
          description: data.message,
          variant: "destructive",
        })
      }

      console.log(data);
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <form className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Login to your account</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Enter your email below to login to your account
        </p>
      </div>
      <div className="grid gap-6">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Password</Label>
            {/* {<a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>} */}
          </div>
          <Input id="password" type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required />
        </div>
        <Button type="submit" onClick={handleSubmit} className="w-full">
          Login
        </Button>

      </div>

    </form>
  )
}
