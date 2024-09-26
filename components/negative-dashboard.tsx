'use client'

import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Header } from './header'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function NegativeDashboard() {
  const [globalNegative, setGlobalNegative] = useState("")
  const [categoryNegative, setCategoryNegative] = useState("")
  const [category, setCategory] = useState("")
  const [negativePrompts, setNegativePrompts] = useState([
    { id: 1, category: "Portrait", prompt: "Blurry, oversaturated" },
    { id: 2, category: "Landscape", prompt: "Overexposed, artificial colors" },
    // Add more mock data as needed
  ])
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    const checkLoginStatus = () => {
      const loggedInStatus = localStorage.getItem('isLoggedIn');
      const storedEmail = localStorage.getItem('email');
      
      if (loggedInStatus === 'true' && storedEmail) {
        setIsLoggedIn(true);
        setEmail(storedEmail);
      } else {
        setIsLoggedIn(false);
        setEmail('');
      }
    };

    checkLoginStatus();

    // Add event listener for storage changes
    window.addEventListener('storage', checkLoginStatus);

    // Cleanup
    return () => {
      window.removeEventListener('storage', checkLoginStatus);
    };
  }, []);

  const handleSave = () => {
    if (category && categoryNegative) {
      const newPrompt = {
        id: negativePrompts.length + 1,
        category: category,
        prompt: categoryNegative
      }
      setNegativePrompts([...negativePrompts, newPrompt])
      setCategory("")
      setCategoryNegative("")
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((email === "nori@dashboard.com" && password === "10312024") || 
        (email === "nayan@dashboard.com" && password === "7069112010")) {
      console.log('Login successful');
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('email', email);
    } else {
      console.log('Login failed');
    }
  };

  const handleLogout = () => {
    console.log('Logging out');
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('email');
  };

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <Header 
        isLoggedIn={isLoggedIn}
        email={email}
        handleLogout={handleLogout}
        handleLogin={handleLogin}
        setEmail={setEmail}
        setPassword={setPassword}
      />
      <h1 className="text-3xl font-bold mb-6">Negative Dashboard</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Category-specific Negative Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input 
                value={category} 
                onChange={(e) => setCategory(e.target.value)}
                placeholder="Enter category"
              />
              <Input 
                value={categoryNegative} 
                onChange={(e) => setCategoryNegative(e.target.value)}
                placeholder="Enter category-specific negative prompt"
              />
              <Button onClick={handleSave}>Save Changes</Button>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Negative Prompts List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Negative Prompt</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {negativePrompts.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell>{item.category}</TableCell>
                    <TableCell>{item.prompt}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}