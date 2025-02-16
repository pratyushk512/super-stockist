'use client'
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useState } from "react";
import { MainNav } from "@/components/admin/main-nav";
import { Search } from "@/components/admin/search";
import { UserNav } from "@/components/admin/user-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { useToast } from "@/hooks/use-toast"
import { error } from "console";
const categories = ["Cardboard","Marker","Pencil","Pen","Scale","Sharpner","Sketchpen","Stapler","Staplerpin","Whitener"];

export default function ProductForm() {
  const { register, handleSubmit,reset, setValue, formState: { errors } } = useForm();
  const { toast } = useToast()
    const onSubmit = async(data:any) => {
        console.log(data);
        const response =await fetch("/api/products/new-product", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(data)
        });
        if (response.ok) {
            toast({
                title: "Product Added Successfully",
              })
        }
        else{
            toast({
                title: "Failed to add product",
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
        <CardTitle>Add Product</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input {...register("name", { required: "Product name is required" })} />
            {errors.name && <p className="text-red-500">{String(errors.name.message)}</p>}
          </div>
          <div>
            <Label>Description</Label>
            <Textarea {...register("description")} />
          </div>
          <div>
            <Label>Price</Label>
            <Input type="string" {...register("price", { required: "Product price is required" })} />
            {errors.price && <p className="text-red-500">{String(errors.price.message)}</p>}
          </div>
          <div>
            <Label>Units per Box</Label>
            <Input type="number" {...register("unitsPerBox", { required: "Units per box is required" })} />
          </div>
          <div>
            <Label>Category</Label>
            <Select onValueChange={(value) => setValue("category", value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Current Stock</Label>
            <Input type="number" {...register("currStock", { required: "Stock quantity is required" })} />
          </div>
          <Button type="submit">Add Product</Button>
        </form>
      </CardContent>
    </Card>
    </>
  );
}