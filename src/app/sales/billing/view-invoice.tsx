"use client";
import { CalendarIcon, PrinterIcon, SaveIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableFooter, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { useEffect, useState } from "react"
import { OrderItem } from "@/types/types";

export default function InvoicePage({invoiceNo}: { invoiceNo: string }) {
  
  // const invoiceData = {
  //   invoiceNumber: "INV-2023-0042",
  //   invoiceDate: "April 12, 2025",
  //   orderDate: "April 10, 2025",
  //   seller: {
  //     name: "JN Traders",
  //     address: "Bye Lane,West Market Road,Upper Bazar",
  //     city: "Ranchi,Jharkhand, 834001",
  //     email: "",
  //     phone: "+91 9431596720",
  //     taxId: "GSTIN: 20AABCU1234C1Z5",
  //   },
  //   customer: {
  //     company: "Smith Enterprises",
  //     address: "456 Commerce Street",
  //     city: "New York, NY 10001",
  //     email: "john@smithenterprises.com",
  //     phone: "+1 (555) 987-6543",
  //     gstIn: "GSTIN: 20AABCU1234C1Z5",
  //   },
  //   items: [
  //     {
  //       id: 1,
  //       name: "Premium Web Hosting (Annual)",
  //       hsnCode: "9983",
  //       price: 199.99,
  //       quantity: 1,
  //       amount: 199.99,
  //     },
  //     {
  //       id: 2,
  //       name: "Custom Website Development",
  //       hsnCode: "9983",
  //       price: 1500.0,
  //       quantity: 1,
  //       amount: 1500.0,
  //     },
  //     {
  //       id: 3,
  //       name: "SEO Package - Basic",
  //       hsnCode: "9983",
  //       price: 299.5,
  //       quantity: 1,
  //       amount: 299.5,
  //     },
  //     {
  //       id: 4,
  //       name: "Content Writing (per 1000 words)",
  //       hsnCode: "9983",
  //       price: 75.0,
  //       quantity: 4,
  //       amount: 300.0,
  //     },
  //   ],
  //   subtotal: 2299.49,
  //   taxDetails: [
  //     { name: "SGST (9%)", amount: 206.95 },
  //     { name: "CGST (9%)", amount: 206.95 },
  //   ],
  //   totalAmount: 2713.39,
  // }
  type InvoiceData = {
    invoiceNumber: string;
    invoiceDate: string;
    orderDate: string;
    seller: {
      name: string;
      address: string;
      city: string;
      email: string;
      phone: string;
      taxId: string;
    };
    customer: {
      company: string;
      address: string;
      city: string;
      email: string;
      phone: string;
      gstIn: string;
    };
    items: OrderItem[];
    subtotal: number;
    taxDetails: {
      name: string;
      amount: number;
    }[];
    totalAmount: number;
  };
  const [invoiceData, setInvoiceData] = useState<InvoiceData | null>(null);
  useEffect(() => {
    const fetchInvoiceData = async () => {
        try {
            const response = await fetch(`/api/invoices/get-invoiceData`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ invoiceNumber: invoiceNo }),
            });

            if (!response.ok) throw new Error("Failed to fetch invoice data");
            const data = await response.json();
            console.log("Fetched invoice data:", data);
            setInvoiceData(data.invoiceData);
        } catch (error) {
            console.error("Error fetching order:", error);
        }
    };
    fetchInvoiceData();
}, [invoiceNo]);

  // Calculate totals
  // const taxTotal = invoiceData.taxDetails.reduce((sum, tax) => sum + tax.amount, 0)

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <div className="flex flex-col gap-8 max-w-4xl mx-auto">
        {/* Header with actions */}
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600">
            Tax Invoice
          </h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="border-purple-200 hover:bg-purple-50">
              <PrinterIcon className="h-4 w-4 mr-2 text-purple-600" />
              Print
            </Button>
            <Button
              size="sm"
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white border-none"
            >
              <SaveIcon className="h-4 w-4 mr-2" />
              Save PDF
            </Button>
          </div>
        </div>

        {/* Invoice header with logo and invoice details */}
        <Card className="p-6 border-none shadow-lg bg-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-100 to-transparent rounded-bl-full opacity-50"></div>
          <div className="flex flex-col md:flex-row justify-between gap-6 relative z-10">
            <div className="flex items-center gap-3">
              <div className="h-14 w-14 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold shadow-md">
                JNT
              </div>
              <div>
                <h2 className="font-bold text-xl">{invoiceData?.seller.name}</h2>
                <p className="text-sm text-gray-500">{invoiceData?.seller.taxId}</p>
              </div>
            </div>
            <div className="space-y-1">
              <h3 className="font-bold text-2xl text-right text-gray-800">#{invoiceData?.invoiceNumber}</h3>
              <div className="flex items-center gap-2 text-sm text-gray-500 justify-end">
                <CalendarIcon className="h-4 w-4 text-purple-500" />
                <span>
                  Issue Date: <span className="font-medium text-gray-700">{invoiceData?.invoiceDate}</span>
                </span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500 justify-end">
                <CalendarIcon className="h-4 w-4 text-purple-500" />
                <span>
                  Order Date: <span className="font-medium text-gray-700">{invoiceData?.orderDate}</span>
                </span>
              </div>
            </div>
          </div>
        </Card>

        {/* Billing details */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 border-none shadow-md bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-purple-600 to-pink-600"></div>
            <h3 className="font-semibold text-purple-600 mb-3">Billed From</h3>
            <div className="space-y-1">
              <p className="font-medium text-gray-800">{invoiceData?.seller.name}</p>
              <p className="text-sm text-gray-600">{invoiceData?.seller.address}</p>
              <p className="text-sm text-gray-600">{invoiceData?.seller.city}</p>
              <p className="text-sm text-gray-600">{invoiceData?.seller.email}</p>
              <p className="text-sm text-gray-600">{invoiceData?.seller.phone}</p>
            </div>
          </Card>

          <Card className="p-6 border-none shadow-md bg-white relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-pink-600 to-purple-600"></div>
            <h3 className="font-semibold text-pink-600 mb-3">Billed To</h3>
            <div className="space-y-1">
              <p className="font-medium text-gray-800">{invoiceData?.customer.company}</p>
              <p className="text-sm text-gray-600">{invoiceData?.customer.address}</p>
              <p className="text-sm text-gray-600">{invoiceData?.customer.city}</p>
              <p className="text-sm text-gray-600">{invoiceData?.customer.email}</p>
              <p className="text-sm text-gray-600">{invoiceData?.customer.phone}</p>
              <p className="text-sm text-gray-600">{invoiceData?.customer.gstIn}</p>
            </div>
          </Card>
        </div>

        {/* Items table */}
        <Card className="overflow-hidden border-none shadow-lg bg-white">
          <div className="p-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-medium">Invoice Items</div>
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableHead className="w-[60px] text-center">Sl. No.</TableHead>
                <TableHead className="w-[300px]">Item</TableHead>
                <TableHead>HSN Code</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoiceData?.items.map((item, index) => (
                <TableRow key={item.productId} className="hover:bg-purple-50">
                  <TableCell className="text-center font-medium text-gray-500">{index + 1}</TableCell>
                  <TableCell className="font-medium">{item.productName}</TableCell>
                  <TableCell className="text-gray-600">{item.hsn}</TableCell>
                  <TableCell className="text-right">₹{item.priceAtTime}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right font-medium">₹{Number(item.total).toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow className="bg-gray-50 hover:bg-gray-50">
                <TableCell colSpan={5} className="text-right font-medium">
                  Subtotal
                </TableCell>
                <TableCell className="text-right">₹{Number(invoiceData?.subtotal).toFixed(2)}</TableCell>
              </TableRow>
              {invoiceData?.taxDetails.map((tax, index) => (
                <TableRow key={index} className="bg-gray-50 hover:bg-gray-50">
                  <TableCell colSpan={5} className="text-right font-medium">
                    {tax.name}
                  </TableCell>
                  <TableCell className="text-right">₹{Number(tax.amount).toFixed(2)}</TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-gradient-to-r from-purple-100 to-pink-100 hover:from-purple-100 hover:to-pink-100">
                <TableCell colSpan={5} className="text-right font-bold text-lg text-gray-800">
                  Total
                </TableCell>
                <TableCell className="text-right font-bold text-lg text-purple-700">
                ₹{Number(invoiceData?.totalAmount).toFixed(2)}
                </TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </Card>

        {/* Notes and terms */}
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="font-semibold text-purple-600 mb-3">Notes</h3>
            <p className="text-sm text-gray-600">
              Thank you for your business. Please make payment within 15 days of receiving this invoice.
            </p>
          </Card>
          <Card className="p-6 border-none shadow-md bg-white">
            <h3 className="font-semibold text-purple-600 mb-3">Payment Details</h3>
            <p className="text-sm text-gray-600">
              <span className="font-medium text-gray-700">Bank:</span> Union Bank of India
              <br />
              <span className="font-medium text-gray-700">Account Name:</span> JN Traders
              <br />
              <span className="font-medium text-gray-700">Account Number:</span> XXXX-XXXX-XXXX-1234
              <br />
              <span className="font-medium text-gray-700">IFSC Code:</span> NTBKUS12
            </p>
          </Card>
        </div>

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 p-6 rounded-lg shadow-md border-none">
          <div className=" text-xs text-gray-400">
            Invoice generated on {invoiceData?.invoiceDate} • JN Traders © 2025
          </div>
        </footer>
      </div>
    </div>
  )
}
