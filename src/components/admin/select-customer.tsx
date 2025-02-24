"use client";

import { Command } from "cmdk";
import { useState, useEffect, useMemo } from "react";
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Customer } from "@/types/types";

interface CustomerSearchProps {
  onSelectCustomer: (customer: Customer) => void;
}

export default function CustomerSearch({ onSelectCustomer }: CustomerSearchProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await fetch("/api/customers/get-all-customers");
        let data = await response.json();
        data=data.customers
        if (!Array.isArray(data)) {
          console.error("Invalid API response:", data);
          return;
        }
        
        setCustomers(data);
      } catch (error) {
        console.error("Error fetching customers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const filteredCustomers = useMemo(() => {
    if (!searchTerm) return customers;
    return customers.filter((customer) =>
      customer.customerName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [customers, searchTerm]);

  if (loading) {
    return <div className="text-center">Loading customers...</div>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" role="combobox" aria-expanded={open} className="w-full justify-between">
          Select a customer
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[400px] p-0">
        <Command>
          <CommandInput placeholder="Search customers..." value={searchTerm} onValueChange={setSearchTerm} />
          <CommandList>
            {filteredCustomers.length === 0 ? (
              <CommandEmpty>No customers found.</CommandEmpty>
            ) : (
              <CommandGroup>
                {filteredCustomers.map((customer) => (
                  <CommandItem
                    key={customer._id}
                    value={customer.customerName}
                    onSelect={() => {
                      onSelectCustomer(customer);
                      setSearchTerm("");
                      setOpen(false);
                    }}
                  >
                    <Check className="mr-2 h-4 w-4 opacity-100" />
                    {customer.customerName}
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}
