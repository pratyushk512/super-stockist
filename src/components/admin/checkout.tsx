import * as React from "react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { CartItem } from "@/app/admin/products/store/page";
import { createOrderByAdmins } from "@/utils/createOrderByAdmins";
import CustomerSearch from "./select-customer";
import { Customer } from "@/types/types";
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation";
function useMediaQuery(query: string) {
  const [matches, setMatches] = useState(false);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event: MediaQueryListEvent) => setMatches(event.matches);

    setMatches(mediaQuery.matches);
    mediaQuery.addEventListener("change", handler);

    return () => mediaQuery.removeEventListener("change", handler);
  }, [query]);

  return matches;
}

export function DrawerDialog({ cart, totalAmount }: { cart: CartItem[], totalAmount: string }) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");

  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [date, setDate] = useState("");
  const { toast } = useToast()
    const router = useRouter();
    
  const handleCheckout =async () => {
    if (!selectedCustomer || !date) {
      console.error("Customer or date is missing");
      return;
    }

    const orderDetails = {
      customerId: selectedCustomer._id,
      orderDate: date,
      totalAmount: totalAmount
    };
    
    const order =await createOrderByAdmins(cart, orderDetails);
    if(order){
      toast({
        title:"Order Created Successfully"
      })
      router.push("/admin/orders");
      console.log("Order created successfully", order);
    }
    else{
      toast({
        title:"Error creating order",
        variant:"destructive"
      })
      console.error("Error creating order");
    }
  };

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="w-full" disabled={cart.length === 0}>Checkout</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Complete Order Details</DialogTitle>
            <DialogDescription>Enter Customer Details</DialogDescription>
          </DialogHeader>
          <OrderDetailsForm 
            selectedCustomer={selectedCustomer} 
            setSelectedCustomer={setSelectedCustomer}
            date={date}
            setDate={setDate}
          />
          <Button className="mt-4" onClick={handleCheckout}>Confirm Order</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>
        <Button>Complete Your Order</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader className="text-left">
          <DrawerTitle>Enter Details</DrawerTitle>
          <DrawerDescription>Enter the details to finish your order</DrawerDescription>
        </DrawerHeader>
        <OrderDetailsForm 
          className="px-4" 
          selectedCustomer={selectedCustomer} 
          setSelectedCustomer={setSelectedCustomer}
          date={date}
          setDate={setDate}
        />
        <DrawerFooter className="pt-2">
          <Button variant="outline" onClick={handleCheckout}>Confirm Order</Button>
          <DrawerClose asChild>
            <Button variant="outline">Cancel</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export default function OrderDetailsForm({
  className,
  selectedCustomer,
  setSelectedCustomer,
  date,
  setDate
}: {
  className?: string;
  selectedCustomer: Customer | null;
  setSelectedCustomer: (customer: Customer | null) => void;
  date: string;
  setDate: (date: string) => void;
}) {
  return (
    <form className={cn("grid items-start gap-4", className)} onSubmit={(e) => e.preventDefault()}>
      <div className="grid gap-2">
        <Label>Select Customer</Label>
        <CustomerSearch onSelectCustomer={setSelectedCustomer} />
        <p>{selectedCustomer ? selectedCustomer.customerName : "No customer selected"}</p>
      </div>
      <div className="grid gap-2">
        <Label>Date</Label>
        <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full" />
      </div>
    </form>
  );
}

