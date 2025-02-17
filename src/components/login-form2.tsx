'use client'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { error } from "console"
import { useRouter } from "next/navigation"
interface LoginFormProps {
    apiURL: string;
    className?: string;
    [key: string]: any;
}

export function LoginForm({ apiURL, className, ...props }: LoginFormProps) {
    const [phone, setPhone] = useState("");
    const [pin, setPin] = useState("");
    const { toast } = useToast()
    const router=useRouter()
    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        console.log(phone, pin)
        try {
            const response = await fetch(apiURL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ phone, pin }),
            });
            console.log("response:", response);
            const data = await response.json();

            console.log("data:",data);

            if (response.ok) {
                router.push("/home")
                toast({
                    title: "Login Successful",
                })
            } else {
                toast({
                    title: "Login Failed",
                    description: data.message,
                    variant: "destructive",
                })
            }
        } catch (error: any) {
            toast({
                title: "Login Failed",
                description: error,
                variant: "destructive",
            })
            console.error("Error:", error);
        }

    };
    return (
        <form className={cn("flex flex-col gap-6", className)} {...props}>
            <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Login to your account</h1>
                <p className="text-balance text-sm text-muted-foreground">
                    Enter your phone no. below to login to your account
                </p>
            </div>
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <Label htmlFor="email">Phone</Label>
                    <Input
                        id="email"
                        type="email"
                        required
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                    />
                </div>
                <div className="grid gap-2">
                    <div className="flex items-center">
                        <Label htmlFor="password">Security Pin</Label>
                        {/* {<a
              href="#"
              className="ml-auto text-sm underline-offset-4 hover:underline"
            >
              Forgot your password?
            </a>} */}
                    </div>
                    <Input id="password" type="password"
                        value={pin}
                        onChange={(e) => setPin(e.target.value)}
                        required />
                </div>
                <Button type="submit" onClick={handleSubmit} className="w-full">
                    Login
                </Button>

            </div>

        </form>
    )
}
