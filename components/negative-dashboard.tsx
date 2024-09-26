'use client'

import React, { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

export function NegativeDashboard() {
  const [globalNegative, setGlobalNegative] = useState("")
  const [categoryNegative, setCategoryNegative] = useState("")
  const [negativePrompts, setNegativePrompts] = useState([
    { id: 1, category: "Portrait", prompt: "Blurry, oversaturated" },
    { id: 2, category: "Landscape", prompt: "Overexposed, artificial colors" },
    // Add more mock data as needed
  ])

  const handleSave = () => {
    // Implement save logic here
    console.log("Saving changes...")
  }

  return (
    <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold mb-6">Negative Dashboard</h1>
      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Global Negative Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <Input 
              value={globalNegative} 
              onChange={(e) => setGlobalNegative(e.target.value)}
              placeholder="Enter global negative prompt"
            />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Category-specific Negative Prompt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
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