"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { LayoutDashboard, ShoppingCart, FileText, Package, Users, UserCircle, Settings, Receipt } from "lucide-react"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import type React from "react"

const items = [
  {
    title: "Home",
    href: "/sales/home",
    icon: LayoutDashboard,
  },
  {
    title: "Orders",
    href: "/sales/orders",
    icon: ShoppingCart,
  },
  {
    title: "Billing",
    href: "/sales/billing",
    icon: FileText,
  },
  {
    title: "Payments",
    href: "/sales/payments",
    icon: Receipt,
  },
  {
    title: "Products",
    href: "/sales/products",
    icon: Package,
  },
]

export function MainNav({ className, ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname()

  return (
    <nav className={className} {...props}>
      {/* Mobile Menu */}
      <div className="md:hidden">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" size="icon">
              <Menu className="h-6 w-6" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left">
            <SheetHeader>
              <SheetTitle>Menu</SheetTitle>
            </SheetHeader>
            <div className="grid gap-4 py-4">
              {items.map((item) => {
                const Icon = item.icon
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm transition-colors hover:text-primary",
                      pathname === item.href ? "text-primary" : "text-muted-foreground",
                    )}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.title}</span>
                  </Link>
                )
              })}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-4 lg:space-x-6">
        {items.map((item) => {
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center text-sm font-medium transition-colors hover:text-primary",
                pathname === item.href ? "text-primary" : "text-muted-foreground",
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              <span>{item.title}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}

