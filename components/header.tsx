import React, { useEffect, useState } from 'react'
import { Camera, LayoutDashboard } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Image from "next/image"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

interface HeaderProps {
  isLoggedIn: boolean
  email: string
  handleLogout: () => void
  handleLogin: (e: React.FormEvent) => void
  setEmail: (email: string) => void
  setPassword: (password: string) => void
}

export function Header({ isLoggedIn, email, handleLogout, handleLogin, setEmail, setPassword }: HeaderProps) {
  const [isNegativeDashboard, setIsNegativeDashboard] = useState(false);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    // This ensures the code runs only on the client side
    setIsClient(true);

    // Check if the current path is '/negative-analysis'
    if (typeof window !== 'undefined') {
      setIsNegativeDashboard(window.location.pathname === '/negative-analysis');
    }
  }, []);

  const openNegativeDashboard = () => {
    if (isClient) {
      window.open('/negative-analysis', '_blank');
    }
  }

  return (
    <div className="flex justify-between items-center fixed_position mnobile-flex-dev">
      <h1 className="text-2xl font-bold flex items-center mobiel-font">
        <Camera className="h-6 w-6 mr-2" />
        AI Lens Dashboard <small> (Staging)</small>
      </h1>
      {isLoggedIn ? (
        <div className="flex items-center space-x-2 mobile-flex">
          {/* Conditional rendering based on the current page */}
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
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <div className="mobile_set flex">
              <Button>Login</Button>
            </div>
          </DialogTrigger>
          <DialogContent className="z-index-999 login-popup">
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
    </div>
  )
}
