"use client"

import React, { useEffect, useState } from 'react'
import { Camera, LayoutDashboard, Menu } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"

interface HeaderProps {
  isLoggedIn: boolean
  email: string
  handleLogout: () => void
  handleLogin: (e: React.FormEvent) => void
  setEmail: (email: string) => void
  setPassword: (password: string) => void
}

export default function Header({ isLoggedIn, email, handleLogout, handleLogin, setEmail, setPassword }: HeaderProps) {
  const [isNegativeDashboard, setIsNegativeDashboard] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    setIsClient(true);
    if (typeof window !== 'undefined') {
      setIsNegativeDashboard(window.location.pathname === '/negative-analysis');
    }
  }, []);

  const openNegativeDashboard = () => {
    if (isClient) {
      window.open('/negative-analysis', '_blank');
    }
  }

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  return (
    <header className="flex justify-between items-center fixed top-0 left-0 right-0 mnobile-flex-dev bg-background z-50 fixed_position-01">
      <h1 className="text-xl md:text-2xl font-bold flex items-center">
        <Camera className="h-6 w-6 mr-2" />
        AI Lens Dashboard <small className="md:inline"> (Staging)</small>
      </h1>
      
      {isLoggedIn ? (
        <>
          {/* Desktop Menu for logged-in users */}
          <div className="hidden md:flex items-center space-x-2">
            {!isNegativeDashboard && (
              <Button variant="outline" onClick={openNegativeDashboard}>
                <LayoutDashboard className="h-4 w-4 mr-2" />
                Negative Analysis
              </Button>
            )}
            {isNegativeDashboard && (
              <Button variant="outline" onClick={() => (window.location.href = '/')}>
                Back to Main Dashboard
              </Button>
            )}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline">{email}</Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu for logged-in users */}
          <div className="md:hidden">
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className='border-none box-none'>
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <SheetHeader>
                  <SheetTitle>Menu</SheetTitle>
                </SheetHeader>
                <div className="py-4 flex flex-col space-y-4">
                  {!isNegativeDashboard && (
                    <Button variant="outline" onClick={() => { openNegativeDashboard(); toggleMobileMenu(); }}>
                      <LayoutDashboard className="h-4 w-4 mr-2" />
                      Negative Analysis
                    </Button>
                  )}
                  {isNegativeDashboard && (
                    <Button variant="outline" onClick={() => { window.location.href = '/'; toggleMobileMenu(); }}>
                      Back to Main Dashboard
                    </Button>
                  )}
                  <Button variant="outline" onClick={handleLogout}>Logout ({email})</Button>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </>
      ) : (
        // Login button for non-logged-in users (both mobile and desktop)
        <Dialog>
          <DialogTrigger asChild>
            <Button>Login</Button>
          </DialogTrigger>
          <DialogContent className="z-50 login-popup">
            <DialogHeader>
              <DialogTitle>Login</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleLogin}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    onChange={(e) => setEmail(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    type="password"
                    onChange={(e) => setPassword(e.target.value)}
                    className="col-span-3"
                    required
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="submit">Login</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      )}
    </header>
  )
}