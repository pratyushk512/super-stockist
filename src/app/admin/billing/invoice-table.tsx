"use client"

import { useEffect, useState } from "react"
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select"
import {
  Card, CardContent, CardDescription, CardHeader, CardTitle,
} from "@/components/ui/card"
import { Eye, Printer, Search } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { useInvoicesStore } from "@/store/invoiceStore"
import Loader from "@/components/Loader"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
//import { PaymentModal } from "./payment-modal"
export function InvoiceTable() {
  const [yearFilter, setYearFilter] = useState<string | undefined>(undefined)
  const [monthFilter, setMonthFilter] = useState<string | undefined>(undefined)
  const [dateFilter, setDateFilter] = useState<string | undefined>(undefined)
  const [customerFilter, setCustomerFilter] = useState("")
  const [statusFilter, setStatusFilter] = useState<string>("all")

  const { invoices, isLoading, fetchInvoices } = useInvoicesStore()

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  // const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null)
  // const [isModalOpen, setIsModalOpen] = useState(false)

  // const handleViewPayments = (invoiceId: string) => {
  //   setSelectedInvoiceId(invoiceId)
  //   setIsModalOpen(true)
  // }

  // const handleCloseModal = () => {
  //   setIsModalOpen(false)
  //   setSelectedInvoiceId(null)
  // }

  const router = useRouter()
  useEffect(() => {
    fetchInvoices()
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader />
      </div>
    )
  }

  const years = [...new Set(invoices.map((inv) => new Date(inv.invoiceDate).getFullYear()))].sort((a, b) => b - a)
  const months = [
    { value: "1", label: "January" },
    { value: "2", label: "February" },
    { value: "3", label: "March" },
    { value: "4", label: "April" },
    { value: "5", label: "May" },
    { value: "6", label: "June" },
    { value: "7", label: "July" },
    { value: "8", label: "August" },
    { value: "9", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ]

  const filteredInvoices = invoices.filter((invoice) => {
    const invoiceDate = new Date(invoice.invoiceDate)
    const invoiceYear = invoiceDate.getFullYear().toString()
    const invoiceMonth = (invoiceDate.getMonth() + 1).toString()
    const invoiceDay = invoiceDate.toISOString().split("T")[0]

    if (yearFilter && yearFilter !== "all" && invoiceYear !== yearFilter) return false
    if (monthFilter && monthFilter !== "all" && invoiceMonth !== monthFilter) return false
    if (dateFilter && invoiceDay !== dateFilter) return false
    if (customerFilter && !invoice.companyName.toLowerCase().includes(customerFilter.toLowerCase())) return false
    if (statusFilter !== "all" && invoice.paymentStatus.toLowerCase() !== statusFilter.toLowerCase()) return false

    return true
  })


  const totalPages = Math.ceil(filteredInvoices.length / pageSize)
  const startIndex = (currentPage - 1) * pageSize
  const currentInvoices = filteredInvoices.slice(startIndex, startIndex + pageSize)

  const handleNext = () => {
    if (currentPage < totalPages) setCurrentPage((prev) => prev + 1)
  }

  const handlePrev = () => {
    if (currentPage > 1) setCurrentPage((prev) => prev - 1)
  }

  const handleViewInvoice = (invoiceNo: string) => {
    console.log("View Invoice:", invoiceNo)
    router.push(`/admin/billing/${invoiceNo}`)
  }


  return (
    <Card className="border-0 shadow-lg">
      <CardHeader className="rounded-t-lg">
        <CardTitle>Invoice Details</CardTitle>
        <CardDescription>Manage and filter your invoice records</CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Select onValueChange={(value) => { setYearFilter(value || undefined); setCurrentPage(1) }}>
            <SelectTrigger><SelectValue placeholder="Filter by Year" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Years</SelectItem>
              {years.map((year) => (
                <SelectItem key={year} value={year.toString()}>{year}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select onValueChange={(value) => { setMonthFilter(value || undefined); setCurrentPage(1) }}>
            <SelectTrigger><SelectValue placeholder="Filter by Month" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Months</SelectItem>
              {months.map((month) => (
                <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input type="date" onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1) }} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search by Customer"
              className="pl-8"
              value={customerFilter}
              onChange={(e) => { setCustomerFilter(e.target.value); setCurrentPage(1) }}
            />
          </div>

          <Select onValueChange={(value) => { setStatusFilter(value); setCurrentPage(1) }}>
            <SelectTrigger><SelectValue placeholder="Filter as Paid/Unpaid" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="paid">Paid</SelectItem>
              <SelectItem value="unpaid">Unpaid</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Table */}
        <div className="rounded-xl border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Sl. No</TableHead>
                <TableHead>Invoice No.</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Total Amount</TableHead>
                <TableHead>Payment Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {currentInvoices.length > 0 ? (
                currentInvoices.map((invoice, index) => (
                  <TableRow key={invoice._id}>
                    <TableCell>{startIndex + index + 1}</TableCell>
                    <TableCell>{invoice.invoiceNumber}</TableCell>
                    <TableCell>{new Date(invoice.invoiceDate).toLocaleDateString()}</TableCell>
                    <TableCell>{invoice.companyName}</TableCell>
                    <TableCell>₹{Number(invoice.totalAmount).toFixed(2)}</TableCell>
                    <TableCell>
                      <Badge
                        variant="secondary"
                        className={invoice.paymentStatus.toLowerCase() === "paid" ? "bg-green-500/10 text-green-500" : "bg-red-500/10 text-red-500"}
                      >
                        {invoice.paymentStatus.toLowerCase() === "paid" ? "Paid" : "Unpaid"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button 
                        variant="outline" 
                        size="sm"
                        className="bg-blue-600"
                        //  onClick={() => handleViewPayments(invoice.invoiceNumber)}
                        >
                          Payments
                        </Button>
                        <Button size="sm" variant="outline" className="bg-yellow-600" onClick={() => handleViewInvoice(invoice.invoiceNumber)}>
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline" className="bg-lime-600">
                          <Printer className="h-4 w-4 mr-1" />
                          Print
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                    No invoices found matching the filters
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <Dialog>
            <DialogContent className="max-w-3xl">
              <DialogHeader>
                <DialogTitle>Payment Details</DialogTitle>
              </DialogHeader>
              {/* {selectedInvoiceId && <PaymentModal invoiceId={selectedInvoiceId} onClose={handleCloseModal} />} */}
            </DialogContent>
          </Dialog>
        </div>

        {/* Pagination Controls */}
        <div className="flex items-center justify-between mt-4">
          <div className="text-sm text-muted-foreground">
            Page {currentPage} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={handlePrev} disabled={currentPage === 1}>
              Previous
            </Button>
            <Button size="sm" onClick={handleNext} disabled={currentPage === totalPages}>
              Next
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
