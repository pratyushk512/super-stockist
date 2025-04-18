import { Search } from '@/components/admin/search'
import { UserNav } from '@/components/admin/user-nav'
import { MainNav } from '@/components/sales/sales-nav'
import { ThemeToggle } from '@/components/theme-toggle'
import React from 'react'

function page() {
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
    <div>Home Sales</div>
    </>
    
  )
}

export default page