// "use client"

// import { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { CalendarIcon, CheckCircle, User } from "lucide-react"
// import { format } from "date-fns"
// import { cn } from "@/lib/utils"
// import { Calendar } from "@/components/ui/calendar"
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
// import { Invoice } from "@/types/types"
// import { useInvoicesStore } from "@/store/invoiceStore"
// import { usePaymentStore } from "@/store/paymentStore"
// // Types based on the schema shown in the image
// interface Payment {
//   _id: string
//   paymentDate: string
//   mode: string
//   invoiceId: string
//   amount: number
//   status: "Pending" | "Verified"
//   salesmanId: string
//   salesmanName: string
// }


// interface PaymentModalProps {
//   invoiceId: string
//   onClose: () => void
// }

// // Mock data - replace with your actual data fetching logic
// const mockPayments: Payment[] = [
//   {
//     _id: "1",
//     paymentDate: "2025-04-15",
//     mode: "Bank Transfer",
//     invoiceId: "3",
//     amount: 3200,
//     status: "Verified",
//     salesmanId: "2",
//     salesmanName: "Jane Smith",
//   },
//   {
//     id: 2,
//     paymentDate: "2025-04-16",
//     mode: "Credit Card",
//     invoiceId: 2,
//     amount: 850,
//     status: "Pending",
//     salesmanId: 1,
//     salesmanName: "John Doe",
//   },
// ]

// const mockInvoices: Invoice[] = [
//   { id: 1, number: "INV-001", customer: "Acme Corp", amount: 1200, date: "2025-04-10", status: "Unpaid" },
//   { id: 2, number: "INV-002", customer: "Globex Inc", amount: 850, date: "2025-04-12", status: "Unpaid" },
//   { id: 3, number: "INV-003", customer: "Stark Industries", amount: 3200, date: "2025-04-15", status: "Paid" },
//   { id: 4, number: "INV-004", customer: "Wayne Enterprises", amount: 1750, date: "2025-04-16", status: "Unpaid" },
// ]

// export function PaymentModal({ invoiceId, onClose }: PaymentModalProps) {
//   const [payment, setPayment] = useState<Payment | null>(null)
//   const [invoice, setInvoice] = useState<Invoice | null>(null)
//   const [showPaymentForm, setShowPaymentForm] = useState(false)

//   // Form state
//   const [date, setDate] = useState<Date | undefined>(new Date())
//   const [mode, setMode] = useState("Bank Transfer")
//   const [amount, setAmount] = useState("")
//   const [salesmanId, setSalesmanId] = useState("1")
//   const {invoices, isLoading, error} = useInvoicesStore()
//   const {payments,fetchPayments} = usePaymentStore()

//   useEffect(() => {
//     const loadPaymentData = async () => {
//     await Promise.all([fetchPayments(), fetchSalesman()])

//       const paymentDetails = payments.find((payment) => payment.invoiceId === invoiceId) || null
//       setPayment(paymentDetails)

//       const invoiceDetails = invoices.find((inv) => inv._id === invoiceId) || null
//       setInvoice(invoiceDetails)

//       // Show payment form if no payment exists
//       if (!paymentDetails) {
//         setShowPaymentForm(true)
//       }
//     }

//     loadPaymentData()
//   }, [invoiceId, fetchPayments, payments, invoices])

//   const handleSubmitPayment = () => {
//     if (!date || !mode || !amount) return

    
//     //setPayment(newPayment)
//     setShowPaymentForm(false)
//   }

//   const handleVerifyPayment = () => {
//     if (!payment) return

//     // In a real app, you would call your API to update the payment status
//     setPayment({ ...payment, status: "Verified" })
//   }

//   if (isLoading) {
//     return <div className="py-8 text-center">Loading payment information...</div>
//   }

//   return (
//     <div className="space-y-6">
//       {/* {invoice && (
//         <div className="flex justify-between items-start mb-6">
//           <div>
//             <h3 className="text-lg font-medium">Invoice #{invoice.invoiceNumber}</h3>
//             <p className="text-sm text-muted-foreground">
//               {invoice.companyName} - ${Number(invoice.totalAmount).toFixed(2)}
//             </p>
//           </div>
//           <Badge variant={invoice.paymentStatus === "Paid" ? "default" : "outline"}>{invoice.paymentStatus}</Badge>
//         </div>
//       )} */}

//       {payment ? (
//         <Card>
//           <CardContent className="pt-6">
//             <div className="grid grid-cols-2 gap-4">
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground mb-1">Payment Date</h4>
//                 <p>{payment.paymentDate}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground mb-1">Payment Mode</h4>
//                 <p>{payment.mode}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground mb-1">Amount</h4>
//                 <p>${payment.amount.toFixed(2)}</p>
//               </div>
//               <div>
//                 <h4 className="text-sm font-medium text-muted-foreground mb-1">Status</h4>
//                 <Badge variant={payment.status === "Verified" ? "default" : "outline"}>{payment.status}</Badge>
//               </div>
//               <div className="col-span-2">
//                 <h4 className="text-sm font-medium text-muted-foreground mb-1">Requested By</h4>
//                 <div className="flex items-center gap-2">
//                   <User className="h-4 w-4 text-muted-foreground" />
//                   {payment.salesmanName}
//                 </div>
//               </div>
//             </div>

//             {payment.status === "Pending" && (
//               <div className="mt-6 flex justify-end">
//                 <Button onClick={handleVerifyPayment}>
//                   <CheckCircle className="h-4 w-4 mr-2" />
//                   Confirm Payment
//                 </Button>
//               </div>
//             )}
//           </CardContent>
//         </Card>
//       ) : showPaymentForm ? (
//         <Card>
//           <CardContent className="pt-6">
//             <form className="space-y-4">
//               <div className="space-y-2">
//                 <Label htmlFor="date">Payment Date</Label>
//                 <Popover>
//                   <PopoverTrigger asChild>
//                     <Button
//                       variant="outline"
//                       className={cn("w-full justify-start text-left font-normal", !date && "text-muted-foreground")}
//                     >
//                       <CalendarIcon className="mr-2 h-4 w-4" />
//                       {date ? format(date, "PPP") : <span>Pick a date</span>}
//                     </Button>
//                   </PopoverTrigger>
//                   <PopoverContent className="w-auto p-0">
//                     <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
//                   </PopoverContent>
//                 </Popover>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="mode">Payment Mode</Label>
//                 <Select value={mode} onValueChange={setMode}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select payment mode" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="Cash">Cash</SelectItem>
//                     <SelectItem value="Credit Card">Credit Card</SelectItem>
//                     <SelectItem value="Bank Transfer">Bank Transfer</SelectItem>
//                     <SelectItem value="Check">Check</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="amount">Amount</Label>
//                 <Input
//                   id="amount"
//                   type="number"
//                   value={amount}
//                   onChange={(e) => setAmount(e.target.value)}
//                   placeholder="0.00"
//                 />
//               </div>

//               <div className="space-y-2">
//                 <Label htmlFor="salesman">Salesman</Label>
//                 <Select value={salesmanId} onValueChange={setSalesmanId}>
//                   <SelectTrigger>
//                     <SelectValue placeholder="Select salesman" />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="1">John Doe</SelectItem>
//                     <SelectItem value="2">Jane Smith</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>

//               <div className="flex justify-end gap-2 pt-2">
//                 <Button type="button" onClick={handleSubmitPayment}>
//                   Submit Payment
//                 </Button>
//               </div>
//             </form>
//           </CardContent>
//         </Card>
//       ) : (
//         <div className="py-4 text-center">
//           <p className="text-muted-foreground mb-4">No payment record found for this invoice.</p>
//           <Button onClick={() => setShowPaymentForm(true)}>Create Payment</Button>
//         </div>
//       )}

//       <div className="flex justify-end mt-6">
//         <Button variant="outline" onClick={onClose}>
//           Close
//         </Button>
//       </div>
//     </div>
//   )
// }
