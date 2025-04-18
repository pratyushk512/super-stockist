'use client'
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { MainNav } from "@/components/admin/main-nav";
import { Search } from "@/components/admin/search";
import { UserNav } from "@/components/admin/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast"

export default function SalesmanForm() {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            fullName: "",
            email: "",
            password: "",
        },
      });
      
    const { toast } = useToast()

    
    const onSubmit = async (data: any) => {
        console.log(data);
        const response = await fetch("/api/users/create-salesman", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            toast({
                title: "Salesman Created Successfully",
            })
        }
        else {
            toast({
                title: "Failed to create salesman",
                description: "Please try again",
                variant: "destructive",
            })
        }
        reset()
    }
    return (
        <>
            <div className="border-b">
                <div className="flex h-16 items-center px-4">
                    <MainNav className="mx-6" />
                    <div className="ml-auto flex items-center space-x-4">
                        <Search />
                        <ThemeToggle />
                        <UserNav />
                    </div>
                </div>
            </div>
            <Card className="m-7 p-5">
                <CardHeader>
                    <CardTitle>Create new Salesman</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label>Full Name</Label>
                            <Input {...register("fullName", { required: "Customer name is required" })} />
                            {errors.fullName && <p className="text-red-500">{String(errors.fullName.message)}</p>}
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input type="string" {...register("email", { required: "Email ID is required" })} />
                            {errors.email && <p className="text-red-500">{String(errors.email.message)}</p>}
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input type="string" {...register("password", { required: "Password is required" })} />
                        </div>
                        <Button type="submit">Add Salesman</Button>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}