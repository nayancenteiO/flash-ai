// components/negative-dashboard.tsx
"use client";

import { useState, useRef, useEffect } from 'react'
import Image from "next/image"
import { Circle, Clock, ChevronLeft, ChevronRight, User, Calendar, Search, Filter } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar as CalendarComponent } from "@/components/ui/calendar"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Header } from './header';
// Mock data for demonstration
const mockFeedback = [
  {
    id: 1,
    userName: "Alice Johnson",
    lensName: "CityScape AI",
    visionModel: "GPT-4 Vision",
    imageGenModel: "DALL-E 3",
    feedback: "The generated image doesn't accurately reflect the style described in the prompt. The colors are off and the composition lacks the requested dynamic feel.",
    prompt: "Create a vibrant, abstract cityscape with bold, neon colors. Incorporate flowing lines and geometric shapes to give a sense of movement and energy. The style should be reminiscent of futuristic cyberpunk art.",
    timestamp: "2023-09-15T14:30:22Z",
  },
  {
    id: 2,
    userName: "Bob Smith",
    lensName: "NatureLens",
    visionModel: "GPT-4 Vision",
    imageGenModel: "Stable Diffusion",
    feedback: "The image lacks detail in the foliage and the lighting doesn't capture the time of day specified in the prompt.",
    prompt: "Generate a serene forest scene at golden hour, with sunlight filtering through dense, lush foliage. Include a small, clear stream with rocks and fallen leaves.",
    timestamp: "2023-09-16T15:45:10Z",
  },
  {
    id: 3,
    userName: "Carol Davis",
    lensName: "PortraitPro",
    visionModel: "GPT-4 Vision",
    imageGenModel: "Midjourney",
    feedback: "The facial features are disproportionate and the skin texture looks artificial. The background doesn't match the described setting.",
    prompt: "Create a portrait of a middle-aged woman with kind eyes and laugh lines. She should be in a cozy kitchen setting with warm, natural lighting.",
    timestamp: "2023-09-17T16:20:05Z",
  },
  {
    id: 4,
    userName: "David Wilson",
    lensName: "TechVision",
    visionModel: "GPT-4 Vision",
    imageGenModel: "DALL-E 3",
    feedback: "The generated image of the futuristic device lacks the sleek design described. The holographic display is not prominent enough.",
    prompt: "Design a cutting-edge smartphone with a seamless holographic display. The device should have a sleek, minimalist design with subtle metallic accents.",
    timestamp: "2023-09-18T17:10:30Z",
  },
  {
    id: 5,
    userName: "Alice Johnson",
    lensName: "CityScape AI",
    visionModel: "GPT-4 Vision",
    imageGenModel: "DALL-E 3",
    feedback: "The generated image doesn't accurately reflect the style described in the prompt. The colors are off and the composition lacks the requested dynamic feel.",
    prompt: "Create a vibrant, abstract cityscape with bold, neon colors. Incorporate flowing lines and geometric shapes to give a sense of movement and energy. The style should be reminiscent of futuristic cyberpunk art.",
    timestamp: "2023-09-15T14:30:22Z",
  },
  {
    id: 6,
    userName: "Bob Smith",
    lensName: "NatureLens",
    visionModel: "GPT-4 Vision",
    imageGenModel: "Stable Diffusion",
    feedback: "The image lacks detail in the foliage and the lighting doesn't capture the time of day specified in the prompt.",
    prompt: "Generate a serene forest scene at golden hour, with sunlight filtering through dense, lush foliage. Include a small, clear stream with rocks and fallen leaves.",
    timestamp: "2023-09-16T15:45:10Z",
  },
  {
    id: 7,
    userName: "Carol Davis",
    lensName: "PortraitPro",
    visionModel: "GPT-4 Vision",
    imageGenModel: "Midjourney",
    feedback: "The facial features are disproportionate and the skin texture looks artificial. The background doesn't match the described setting.",
    prompt: "Create a portrait of a middle-aged woman with kind eyes and laugh lines. She should be in a cozy kitchen setting with warm, natural lighting.",
    timestamp: "2023-09-17T16:20:05Z",
  },
  {
    id: 8,
    userName: "David Wilson",
    lensName: "TechVision",
    visionModel: "GPT-4 Vision",
    imageGenModel: "DALL-E 3",
    feedback: "The generated image of the futuristic device lacks the sleek design described. The holographic display is not prominent enough.",
    prompt: "Design a cutting-edge smartphone with a seamless holographic display. The device should have a sleek, minimalist design with subtle metallic accents.",
    timestamp: "2023-09-18T17:10:30Z",
  },
  {
    id: 9,
    userName: "Alice Johnson",
    lensName: "CityScape AI",
    visionModel: "GPT-4 Vision",
    imageGenModel: "DALL-E 3",
    feedback: "The generated image doesn't accurately reflect the style described in the prompt. The colors are off and the composition lacks the requested dynamic feel.",
    prompt: "Create a vibrant, abstract cityscape with bold, neon colors. Incorporate flowing lines and geometric shapes to give a sense of movement and energy. The style should be reminiscent of futuristic cyberpunk art.",
    timestamp: "2023-09-15T14:30:22Z",
  },
  {
    id: 10,
    userName: "Bob Smith",
    lensName: "NatureLens",
    visionModel: "GPT-4 Vision",
    imageGenModel: "Stable Diffusion",
    feedback: "The image lacks detail in the foliage and the lighting doesn't capture the time of day specified in the prompt.",
    prompt: "Generate a serene forest scene at golden hour, with sunlight filtering through dense, lush foliage. Include a small, clear stream with rocks and fallen leaves.",
    timestamp: "2023-09-16T15:45:10Z",
  },
  {
    id: 11,
    userName: "Carol Davis",
    lensName: "PortraitPro",
    visionModel: "GPT-4 Vision",
    imageGenModel: "Midjourney",
    feedback: "The facial features are disproportionate and the skin texture looks artificial. The background doesn't match the described setting.",
    prompt: "Create a portrait of a middle-aged woman with kind eyes and laugh lines. She should be in a cozy kitchen setting with warm, natural lighting.",
    timestamp: "2023-09-17T16:20:05Z",
  },
  {
    id: 12,
    userName: "David Wilson",
    lensName: "TechVision",
    visionModel: "GPT-4 Vision",
    imageGenModel: "DALL-E 3",
    feedback: "The generated image of the futuristic device lacks the sleek design described. The holographic display is not prominent enough.",
    prompt: "Design a cutting-edge smartphone with a seamless holographic display. The device should have a sleek, minimalist design with subtle metallic accents.",
    timestamp: "2023-09-18T17:10:30Z",
  },
  {
    id: 13,
    userName: "Alice Johnson",
    lensName: "CityScape AI",
    visionModel: "GPT-4 Vision",
    imageGenModel: "DALL-E 3",
    feedback: "The generated image doesn't accurately reflect the style described in the prompt. The colors are off and the composition lacks the requested dynamic feel.",
    prompt: "Create a vibrant, abstract cityscape with bold, neon colors. Incorporate flowing lines and geometric shapes to give a sense of movement and energy. The style should be reminiscent of futuristic cyberpunk art.",
    timestamp: "2023-09-15T14:30:22Z",
  },
  {
    id: 14,
    userName: "Bob Smith",
    lensName: "NatureLens",
    visionModel: "GPT-4 Vision",
    imageGenModel: "Stable Diffusion",
    feedback: "The image lacks detail in the foliage and the lighting doesn't capture the time of day specified in the prompt.",
    prompt: "Generate a serene forest scene at golden hour, with sunlight filtering through dense, lush foliage. Include a small, clear stream with rocks and fallen leaves.",
    timestamp: "2023-09-16T15:45:10Z",
  },
  {
    id: 15,
    userName: "Carol Davis",
    lensName: "PortraitPro",
    visionModel: "GPT-4 Vision",
    imageGenModel: "Midjourney",
    feedback: "The facial features are disproportionate and the skin texture looks artificial. The background doesn't match the described setting.",
    prompt: "Create a portrait of a middle-aged woman with kind eyes and laugh lines. She should be in a cozy kitchen setting with warm, natural lighting.",
    timestamp: "2023-09-17T16:20:05Z",
  },
  {
    id: 16,
    userName: "David Wilson",
    lensName: "TechVision",
    visionModel: "GPT-4 Vision",
    imageGenModel: "DALL-E 3",
    feedback: "The generated image of the futuristic device lacks the sleek design described. The holographic display is not prominent enough.",
    prompt: "Design a cutting-edge smartphone with a seamless holographic display. The device should have a sleek, minimalist design with subtle metallic accents.",
    timestamp: "2023-09-18T17:10:30Z",
  },

]

export default function NegativeFeedbackAnalysis() {
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsPerPage] = useState(8)
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const filteredFeedback = mockFeedback.filter(item =>
    (item.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.lensName.toLowerCase().includes(searchTerm.toLowerCase())) &&
    (!selectedDate || new Date(item.timestamp).toDateString() === selectedDate.toDateString())
  )
  const handleLogout = () => {
    console.log('Logging out');
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('email');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out.",
    });
  };
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if ((email === "nori@dashboard.com" && password === "10312024") || 
        (email === "nayan@dashboard.com" && password === "7069112010")) {
      console.log('Login successful');
      setIsLoggedIn(true);
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('email', email);
      toast({
        title: "Login Successful",
        description: "Welcome to the AI Lens Management Dashboard!",
      });
    } else {
      console.log('Login failed');
      toast({
        title: "Login Failed",
        description: "Invalid email or password. Please try again.",
        variant: "destructive",
      });
    }
  };
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
  const totalPages = Math.ceil(filteredFeedback.length / itemsPerPage)
  const currentFeedback = filteredFeedback.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage)

  return (
    <div className="container mx-auto p-4 sm:p-6 margin-top">
      <Header 
        isLoggedIn={isLoggedIn}
        email={email}
        handleLogout={handleLogout}
        handleLogin={handleLogin}
        setEmail={setEmail}
        setPassword={setPassword}
      />  
       {isLoggedIn && ( 
        <>
          <Card>
        <CardHeader  className='less-pad'>
          <CardTitle className="text-xl sm:text-2xl">Negative Feedback Analysis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row justify-between gap-4 mb-4">
            <div className="flex-1 relative">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search by user or lens name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8"
              />
            </div>
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="sm:hidden">
                    <Filter className="h-4 w-4 mr-2" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Filters</SheetTitle>
                    <SheetDescription>Adjust your view settings here.</SheetDescription>
                  </SheetHeader>
                  <div className="py-4 space-y-4">
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start text-left font-normal">
                          <Calendar className="mr-2 h-4 w-4" />
                          {selectedDate ? selectedDate.toDateString() : "Pick a date"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <CalendarComponent
                          mode="single"
                          selected={selectedDate}
                          onSelect={setSelectedDate}
                          
                        />
                      </PopoverContent>
                    </Popover>
                    <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Items per page" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="8">8 per page</SelectItem>
                        <SelectItem value="16">16 per page</SelectItem>
                        <SelectItem value="32">32 per page</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </SheetContent>
              </Sheet>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="hidden sm:flex">
                    <Calendar className="mr-2 h-4 w-4" />
                    {selectedDate ? selectedDate.toDateString() : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <CalendarComponent
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                  />
                </PopoverContent>
              </Popover>
              <div className="hidden sm:inline-flex">
                <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                    <SelectTrigger>
                    <SelectValue placeholder="Items per page" />
                    </SelectTrigger>
                    <SelectContent>
                    <SelectItem value="8">8 per page</SelectItem>
                    <SelectItem value="16">16 per page</SelectItem>
                    <SelectItem value="32">32 per page</SelectItem>
                    </SelectContent>
                </Select>
                </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {currentFeedback.map((item) => (
              <Card key={item.id} className="flex flex-col">
                <CardContent className="p-3 sm:p-4 flex-grow">
                  <div className="space-y-2 sm:space-y-3">
                    <div className="flex justify-center">
                      <div className="relative w-full aspect-[4/3] sm:aspect-square">
                        <Image
                          src="/flash_favicon.png"
                          alt="Analyzed Image"
                          layout="fill"
                          objectFit="cover"
                          className="rounded-lg"
                        />
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                          <AvatarFallback>
                            <Circle className="h-3 w-3 sm:h-4 sm:w-4" aria-label="AI Lens Icon" />
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <h3 className="font-semibold text-xs sm:text-sm">{item.lensName}</h3>
                          <div className="flex items-center space-x-1">
                            <User className="h-2 w-2 sm:h-3 sm:w-3" />
                            <p className="text-[10px] sm:text-xs text-muted-foreground">{item.userName}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      <Badge variant="secondary" className="text-[10px] sm:text-xs">{item.visionModel}</Badge>
                      <Badge variant="outline" className="text-[10px] sm:text-xs">{item.imageGenModel}</Badge>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-[10px] sm:text-xs">Feedback:</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">{item.feedback}</p>
                    </div>
                    <div className="space-y-1">
                      <h4 className="font-semibold text-[10px] sm:text-xs">Prompt:</h4>
                      <p className="text-[10px] sm:text-xs text-muted-foreground line-clamp-2">{item.prompt}</p>
                    </div>
                    <div className="flex items-center space-x-1 text-[10px] sm:text-xs text-muted-foreground">
                      <Clock className="h-2 w-2 sm:h-3 sm:w-3" />
                      <span>{new Date(item.timestamp).toLocaleString()}</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <span className="text-sm">Page {currentPage} of {totalPages}</span>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </CardFooter>
      </Card>
        </>
       )}
      
    </div>
  )
}