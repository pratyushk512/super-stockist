'use client'
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MainNav } from "@/components/admin/main-nav";
import { Search } from "@/components/admin/search";
import { UserNav } from "@/components/admin/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast"
import { error } from "console";

export default function CustomerForm() {
    const { register, handleSubmit, reset, setValue, formState: { errors } } = useForm({
        defaultValues: {
            customerName: "",
            phone: "",
            email: "",
            address: "",
          salesman: "",
        },
      });
      
    const { toast } = useToast()

    const salesman = ["sales1", "sales2", "sales3"]
    const onSubmit = async (data: any) => {
        console.log(data);
        const response = await fetch("/api/users/create-customer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        if (response.ok) {
            toast({
                title: "Customer Created Successfully",
            })
        }
        else {
            toast({
                title: "Failed to add customer",
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
                    <CardTitle>Create new Customer</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div>
                            <Label>Customer Name</Label>
                            <Input {...register("customerName", { required: "Customer name is required" })} />
                            {errors.customerName && <p className="text-red-500">{String(errors.customerName.message)}</p>}
                        </div>
                        <div>
                            <Label>Phone No.</Label>
                            <Input type="number" {...register("phone")} />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input type="string" {...register("email", { required: "Email ID is required" })} />
                            {errors.email && <p className="text-red-500">{String(errors.email.message)}</p>}
                        </div>
                        <div>
                            <Label>Address</Label>
                            <Input type="string" {...register("address", { required: "Address is required" })} />
                        </div>
                        <div>
                            <Label>Select Salesman</Label>
                            <Select onValueChange={(value) => setValue("salesman", value, { shouldValidate: true })}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select salesman" />
                                </SelectTrigger>
                                <SelectContent>
                                    {salesman.map((cat) => (
                                        <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.salesman && <p className="text-red-500">{String(errors.salesman.message)}</p>}

                        </div>
                        <Button type="submit">Add Customer</Button>
                    </form>
                </CardContent>
            </Card>
        </>
    );
}