"use client"

import { useState } from 'react'
import { Line, LineChart, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis } from 'recharts'
import { CalendarIcon, DownloadIcon, FilterIcon } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

// Mock data for demonstration
const mockData = [
  { date: '2023-06-01', users: 320 },
  { date: '2023-06-02', users: 340 },
  { date: '2023-06-03', users: 360 },
  { date: '2023-06-04', users: 330 },
  { date: '2023-06-05', users: 350 },
]

const countryData = [
  { name: 'USA', value: 400 },
  { name: 'UK', value: 300 },
  { name: 'Canada', value: 200 },
  { name: 'Australia', value: 100 },
  { name: 'Others', value: 150 },
]

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8']

export default function Dashboard() {
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10
  const totalPages = Math.ceil(10000 / itemsPerPage)

  return (
    <div className="flex flex-col space-y-4 p-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">iOS App Analytics Dashboard</h1>
        <div className="flex space-x-2">
          <Button variant="outline">
            <CalendarIcon className="mr-2 h-4 w-4" /> Date Range
          </Button>
          <Button variant="outline">
            <FilterIcon className="mr-2 h-4 w-4" /> Filters
          </Button>
          <Button variant="outline">
            <DownloadIcon className="mr-2 h-4 w-4" /> Export
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-1">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">10,234</div>
            <p className="text-xs text-muted-foreground">+2.5% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
            <Card className="col-span-4">
              <CardHeader>
                <CardTitle>Daily User Activity</CardTitle>
              </CardHeader>
              <CardContent className="pl-2">
                <ChartContainer
                  config={{
                    users: {
                      label: "Users",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={mockData}>
                      <XAxis dataKey="date" />
                      <YAxis />
                      <ChartTooltip content={<ChartTooltipContent />} />
                      <Line type="monotone" dataKey="users" stroke="var(--color-users)" strokeWidth={2} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
            <Card className="col-span-3">
              <CardHeader>
                <CardTitle>Users by Country</CardTitle>
              </CardHeader>
              <CardContent>
                <ChartContainer
                  config={{
                    value: {
                      label: "Users",
                      color: "hsl(var(--chart-1))",
                    },
                  }}
                  className="h-[200px]"
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={countryData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {countryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <ChartTooltip content={<ChartTooltipContent />} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Detailed User Activity</CardTitle>
          <CardDescription>A comprehensive view of user interactions with the app.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex justify-between mb-4">
            <div className="flex space-x-2">
              <Input className="w-[300px]" placeholder="Search by User ID, Country, City..." />
            </div>
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <div className="text-sm">
                Page {currentPage} of {totalPages}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Timestamp</TableHead>
                  <TableHead>Country</TableHead>
                  <TableHead>City</TableHead>
                  <TableHead>User ID</TableHead>
                  <TableHead>Max token</TableHead>
                  <TableHead>Vision model</TableHead>
                  <TableHead>Lens name</TableHead>
                  <TableHead>Image gen model</TableHead>
                  <TableHead>Image gen type</TableHead>
                  <TableHead>Prompt</TableHead>
                  <TableHead>Quality</TableHead>
                  <TableHead>System prompt</TableHead>
                  <TableHead>Style prompt</TableHead>
                  <TableHead>Negative prompt</TableHead>
                  <TableHead>Last prompt</TableHead>
                  <TableHead>Generated prompt</TableHead>
                  <TableHead>Final generated prompt</TableHead>
                  <TableHead>Prompt gen time</TableHead>
                  <TableHead>Image gen time</TableHead>
                  <TableHead>Input image resolution</TableHead>
                  <TableHead>Gen image resolution</TableHead>
                  <TableHead>Upscale</TableHead>
                  <TableHead>Upscale model</TableHead>
                  <TableHead>Upscale time</TableHead>
                  <TableHead>Input image size</TableHead>
                  <TableHead>Output image size</TableHead>
                  <TableHead>Total waiting time</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Array.from({ length: 1 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell>2023-06-{String(i + 1).padStart(2, '0')}</TableCell>
                    <TableCell>14:30:00</TableCell>
                    <TableCell>USA</TableCell>
                    <TableCell>New York</TableCell>
                    <TableCell>user_{1000 + i}</TableCell>
                    <TableCell>1024</TableCell>
                    <TableCell>GPT-4 Vision</TableCell>
                    <TableCell>Wide Angle</TableCell>
                    <TableCell>Stable Diffusion XL</TableCell>
                    <TableCell>Text-to-Image</TableCell>
                    <TableCell>A futuristic cityscape</TableCell>
                    <TableCell>High</TableCell>
                    <TableCell>Analyze the image</TableCell>
                    <TableCell>Cyberpunk style</TableCell>
                    <TableCell>Blurry, low quality</TableCell>
                    <TableCell>Add flying cars</TableCell>
                    <TableCell>Neon-lit skyscrapers</TableCell>
                    <TableCell>Futuristic cityscape with flying cars and neon-lit skyscrapers</TableCell>
                    <TableCell>1.5s</TableCell>
                    <TableCell>3.7s</TableCell>
                    <TableCell>1024x1024</TableCell>
                    <TableCell>1024x1024</TableCell>
                    <TableCell>Yes</TableCell>
                    <TableCell>Real-ESRGAN</TableCell>
                    <TableCell>2.1s</TableCell>
                    <TableCell>2.5MB</TableCell>
                    <TableCell>5.8MB</TableCell>
                    <TableCell>7.3s</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}