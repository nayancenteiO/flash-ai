'use client'

import { useState, useEffect } from 'react'
import { Camera, Loader2, Copy, Trash2, MoveUp, MoveDown, LogIn, Menu, Upload, Plus, Search } from 'lucide-react'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Slider } from "@/components/ui/slider"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter} from "@/components/ui/dialog"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Textarea } from "@/components/ui/textarea"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Label } from "@/components/ui/label"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { toast } from "@/components/ui/use-toast"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Checkbox } from "@/components/ui/checkbox"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Header } from './header'
import { ModelDropdown } from './Model-Dropdown'

type Lens = {
  id: number;
  name: string;
  display: boolean;
  creditconsumption: number;
  imageToTextModel: string;
  maxTokens: number;
  textToImageModel: string;
  upscaleModel: string;
  lastUpdate: Date;
  prompt: string;
  stylePrompt: string;
  negativePrompt: string;
  steps: number;
  cfgScale: number;
  image: string | null;
  usageCount: number;
};
// Mock data for the lenses
const initialLenses: Lens[]= [
  {
    id: 1,
    name: "Portrait Enhancer",
    display: true,
    creditconsumption: 1,
    imageToTextModel: "GPT-4-Vision",
    maxTokens: 1000,
    textToImageModel: "DALL-E 3",
    upscaleModel: "Real-ESRGAN",
    lastUpdate: new Date("2023-05-15"),
    prompt: "Enhance portrait features",
    stylePrompt: "Soft lighting, warm tones",
    negativePrompt: "Harsh shadows, oversaturation",
    steps: 30,
    cfgScale: 7,
    image: null,
    usageCount: 150,
  },
  {
    id: 2,
    name: "Landscape Optimizer",
    display: false,
    creditconsumption: 2,
    imageToTextModel: "CLIP",
    maxTokens: 500,
    textToImageModel: "Stable Diffusion",
    upscaleModel: "Waifu2x",
    lastUpdate: new Date("2023-06-01"),
    prompt: "Optimize landscape colors and details",
    stylePrompt: "Vibrant colors, high contrast",
    negativePrompt: "Blurry, low contrast",
    steps: 40,
    cfgScale: 8,
    image: null,
    usageCount: 75,
  },
  {
    id: 3,
    name: "Portrait Enhancer",
    display: true,
    creditconsumption: 1,
    imageToTextModel: "GPT-4-Vision",
    maxTokens: 1000,
    textToImageModel: "DALL-E 3",
    upscaleModel: "Real-ESRGAN",
    lastUpdate: new Date("2023-05-15"),
    prompt: "Enhance portrait features",
    stylePrompt: "Soft lighting, warm tones",
    negativePrompt: "Harsh shadows, oversaturation",
    steps: 30,
    cfgScale: 7,
    image: null,
    usageCount: 150,
  },
  {
    id: 4,
    name: "Landscape Optimizer",
    display: false,
    creditconsumption: 2,
    imageToTextModel: "CLIP",
    maxTokens: 500,
    textToImageModel: "Stable Diffusion",
    upscaleModel: "Waifu2x",
    lastUpdate: new Date("2023-06-01"),
    prompt: "Optimize landscape colors and details",
    stylePrompt: "Vibrant colors, high contrast",
    negativePrompt: "Blurry, low contrast",
    steps: 40,
    cfgScale: 8,
    image: null,
    usageCount: 75,
  },
  {
    id: 5,
    name: "Portrait Enhancer",
    display: true,
    creditconsumption: 1,
    imageToTextModel: "GPT-4-Vision",
    maxTokens: 1000,
    textToImageModel: "DALL-E 3",
    upscaleModel: "Real-ESRGAN",
    lastUpdate: new Date("2023-05-15"),
    prompt: "Enhance portrait features",
    stylePrompt: "Soft lighting, warm tones",
    negativePrompt: "Harsh shadows, oversaturation",
    steps: 30,
    cfgScale: 7,
    image: null,
    usageCount: 150,
  },
  {
    id: 6,
    name: "Landscape Optimizer",
    display: false,
    creditconsumption: 2,
    imageToTextModel: "CLIP",
    maxTokens: 500,
    textToImageModel: "Stable Diffusion",
    upscaleModel: "Waifu2x",
    lastUpdate: new Date("2023-06-01"),
    prompt: "Optimize landscape colors and details",
    stylePrompt: "Vibrant colors, high contrast",
    negativePrompt: "Blurry, low contrast",
    steps: 40,
    cfgScale: 8,
    image: null,
    usageCount: 75,
  },
  {
    id: 7,
    name: "Portrait Enhancer",
    display: true,
    creditconsumption: 1,
    imageToTextModel: "GPT-4-Vision",
    maxTokens: 1000,
    textToImageModel: "DALL-E 3",
    upscaleModel: "Real-ESRGAN",
    lastUpdate: new Date("2023-05-15"),
    prompt: "Enhance portrait features",
    stylePrompt: "Soft lighting, warm tones",
    negativePrompt: "Harsh shadows, oversaturation",
    steps: 30,
    cfgScale: 7,
    image: null,
    usageCount: 150,
  },
  {
    id: 8,
    name: "Landscape Optimizer",
    display: false,
    creditconsumption: 2,
    imageToTextModel: "CLIP",
    maxTokens: 500,
    textToImageModel: "Stable Diffusion",
    upscaleModel: "Waifu2x",
    lastUpdate: new Date("2023-06-01"),
    prompt: "Optimize landscape colors and details",
    stylePrompt: "Vibrant colors, high contrast",
    negativePrompt: "Blurry, low contrast",
    steps: 40,
    cfgScale: 8,
    image: null,
    usageCount: 75,
  },
  {
    id: 9,
    name: "Portrait Enhancer",
    display: true,
    creditconsumption: 1,
    imageToTextModel: "GPT-4-Vision",
    maxTokens: 1000,
    textToImageModel: "DALL-E 3",
    upscaleModel: "Real-ESRGAN",
    lastUpdate: new Date("2023-05-15"),
    prompt: "Enhance portrait features",
    stylePrompt: "Soft lighting, warm tones",
    negativePrompt: "Harsh shadows, oversaturation",
    steps: 30,
    cfgScale: 7,
    image: null,
    usageCount: 150,
  },
  {
    id: 10,
    name: "Landscape Optimizer",
    display: false,
    creditconsumption: 2,
    imageToTextModel: "CLIP",
    maxTokens: 500,
    textToImageModel: "Stable Diffusion",
    upscaleModel: "Waifu2x",
    lastUpdate: new Date("2023-06-01"),
    prompt: "Optimize landscape colors and details",
    stylePrompt: "Vibrant colors, high contrast",
    negativePrompt: "Blurry, low contrast",
    steps: 40,
    cfgScale: 8,
    image: null,
    usageCount: 75,
  },
  {
    id: 11,
    name: "Portrait Enhancer",
    display: true,
    creditconsumption: 1,
    imageToTextModel: "GPT-4-Vision",
    maxTokens: 1000,
    textToImageModel: "DALL-E 3",
    upscaleModel: "Real-ESRGAN",
    lastUpdate: new Date("2023-05-15"),
    prompt: "Enhance portrait features",
    stylePrompt: "Soft lighting, warm tones",
    negativePrompt: "Harsh shadows, oversaturation",
    steps: 30,
    cfgScale: 7,
    image: null,
    usageCount: 150,
  },
  {
    id: 12,
    name: "Landscape Optimizer",
    display: false,
    creditconsumption: 2,
    imageToTextModel: "CLIP",
    maxTokens: 500,
    textToImageModel: "Stable Diffusion",
    upscaleModel: "Waifu2x",
    lastUpdate: new Date("2023-06-01"),
    prompt: "Optimize landscape colors and details",
    stylePrompt: "Vibrant colors, high contrast",
    negativePrompt: "Blurry, low contrast",
    steps: 40,
    cfgScale: 8,
    image: null,
    usageCount: 75,
  },
  {
    id: 13,
    name: "Portrait Enhancer",
    display: true,
    creditconsumption: 1,
    imageToTextModel: "GPT-4-Vision",
    maxTokens: 1000,
    textToImageModel: "DALL-E 3",
    upscaleModel: "Real-ESRGAN",
    lastUpdate: new Date("2023-05-15"),
    prompt: "Enhance portrait features",
    stylePrompt: "Soft lighting, warm tones",
    negativePrompt: "Harsh shadows, oversaturation",
    steps: 30,
    cfgScale: 7,
    image: null,
    usageCount: 150,
  },
  {
    id: 14,
    name: "Landscape Optimizer",
    display: false,
    creditconsumption: 2,
    imageToTextModel: "CLIP",
    maxTokens: 500,
    textToImageModel: "Stable Diffusion",
    upscaleModel: "Waifu2x",
    lastUpdate: new Date("2023-06-01"),
    prompt: "Optimize landscape colors and details",
    stylePrompt: "Vibrant colors, high contrast",
    negativePrompt: "Blurry, low contrast",
    steps: 40,
    cfgScale: 8,
    image: null,
    usageCount: 75,
  },
  {
    id: 15,
    name: "Portrait Enhancer",
    display: true,
    creditconsumption: 1,
    imageToTextModel: "GPT-4-Vision",
    maxTokens: 1000,
    textToImageModel: "DALL-E 3",
    upscaleModel: "Real-ESRGAN",
    lastUpdate: new Date("2023-05-15"),
    prompt: "Enhance portrait features",
    stylePrompt: "Soft lighting, warm tones",
    negativePrompt: "Harsh shadows, oversaturation",
    steps: 30,
    cfgScale: 7,
    image: null,
    usageCount: 150,
  },
  {
    id: 16,
    name: "Landscape Optimizer",
    display: false,
    creditconsumption: 2,
    imageToTextModel: "CLIP",
    maxTokens: 500,
    textToImageModel: "Stable Diffusion",
    upscaleModel: "Waifu2x",
    lastUpdate: new Date("2023-06-01"),
    prompt: "Optimize landscape colors and details",
    stylePrompt: "Vibrant colors, high contrast",
    negativePrompt: "Blurry, low contrast",
    steps: 40,
    cfgScale: 8,
    image: null,
    usageCount: 75,
  },
  {
    id: 17,
    name: "Portrait Enhancer",
    display: true,
    creditconsumption: 1,
    imageToTextModel: "GPT-4-Vision",
    maxTokens: 1000,
    textToImageModel: "DALL-E 3",
    upscaleModel: "Real-ESRGAN",
    lastUpdate: new Date("2023-05-15"),
    prompt: "Enhance portrait features",
    stylePrompt: "Soft lighting, warm tones",
    negativePrompt: "Harsh shadows, oversaturation",
    steps: 30,
    cfgScale: 7,
    image: null,
    usageCount: 150,
  },
]

export function AiLensDashboard() {
  const [lenses, setLenses] = useState<Lens[]>(initialLenses);
  const [isLoading, setIsLoading] = useState(false);
  const [systemPrompt, setSystemPrompt] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [entriesPerPage, setEntriesPerPage] = useState("All")
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    description: "",
    category: "",
    subscribe: false,
    preference: "",
    attachment: null as File | null
  });
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) { // Add class if scrolled down more than 50px
        document.body.classList.add('scrolled');
        setIsScrolled(true);
      } else {
        document.body.classList.remove('scrolled');
        setIsScrolled(false);
      }
    };

    // Add the scroll event listener
    window.addEventListener('scroll', handleScroll);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
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

  const handleRefresh = () => {
    setIsLoading(true)
    // Simulate an API call
    setTimeout(() => {
      setLenses(lenses.map(lens => ({ ...lens, lastUpdate: new Date() })))
      setIsLoading(false)
    }, 1000)
  }
  const handleModelSelect = (option: string) => {
    // Handle the selected option here
    console.log(`Selected option: ${option}`)
    toast({
      title: "Model Action",
      description: `You selected: ${option}`,
    })
    // You can add more specific logic for each option here
  }
  const filteredLenses = lenses.filter(lens =>
    lens.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lens.imageToTextModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lens.textToImageModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lens.upscaleModel.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lens.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lens.stylePrompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
    lens.negativePrompt.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const displayedLenses = entriesPerPage === "All" 
    ? filteredLenses 
    : filteredLenses.slice(0, parseInt(entriesPerPage));

  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Here you would typically send the formData to your backend
    // For this example, we'll just update the lenses with a new timestamp
    setTimeout(() => {
      setLenses(lenses.map(lens => ({ ...lens, lastUpdate: new Date() })));
      setIsLoading(false);
      setIsModalOpen(false);
      toast({
        title: "Lenses Refreshed",
        description: "Your lenses have been updated with the new information.",
      });
    }, 1000);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }));
  };

  const handleSelectChange = (value: string) => {
    setFormData(prev => ({ ...prev, category: value }));
  };

  const handleRadioChange = (value: string) => {
    setFormData(prev => ({ ...prev, preference: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFormData(prev => ({ ...prev, attachment: e.target.files![0] }));
    }
  };

  const handleDisplayToggle = (id: number) => {
    setLenses(lenses.map(lens => 
      lens.id === id ? { ...lens, display: !lens.display } : lens
    ))
  }

  const handleLensInputChange = (id: number, field: keyof Lens, value: string | number) => {
    setLenses(lenses.map(lens => 
      lens.id === id ? { ...lens, [field]: value } : lens
    ))
  }

  const handleCopyLens = (id: number) => {
    const lensToCopy = lenses.find(lens => lens.id === id)
    if (lensToCopy) {
      const newLens = {
        ...lensToCopy,
        id: Math.max(...lenses.map(l => l.id)) + 1,
        name: `${lensToCopy.name} (Copy)`,
        lastUpdate: new Date(),
        usageCount: 0,
      }
      setLenses([...lenses, newLens])
    }
  }

  const handleDeleteLens = (id: number) => {
    setLenses(lenses.filter(lens => lens.id !== id))
  }

  const handleMoveLens = (id: number, direction: 'up' | 'down') => {
    const index = lenses.findIndex(lens => lens.id === id)
    if (
      (direction === 'up' && index > 0) ||
      (direction === 'down' && index < lenses.length - 1)
    ) {
      const newLenses = [...lenses]
      const [removed] = newLenses.splice(index, 1)
      newLenses.splice(direction === 'up' ? index - 1 : index + 1, 0, removed)
      setLenses(newLenses)
    }
  }

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === "nori@dashboard.com" && password === "10312024") {
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

  const handleImageUpload = (id: number, file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      setLenses(lenses.map(lens => 
        lens.id === id ? { ...lens, image: e.target?.result as string | null } : lens
      ))
    }
    reader.readAsDataURL(file)
  }

  interface PromptPopoverProps {
    value: string;
    onChange: (event: React.ChangeEvent<HTMLTextAreaElement>) => void;
    title: string;
  }

  const PromptPopover: React.FC<PromptPopoverProps> = ({ value, onChange, title }) => (
  <Popover>
    <PopoverTrigger asChild>
      <Button variant="outline" className="w-full justify-start truncate">
        {value || "Edit prompt"}
      </Button>
    </PopoverTrigger>
    <PopoverContent className="w-80">
      <div className="grid gap-4">
        <h4 className="font-medium leading-none">{title}</h4>
        <Textarea
          value={value}
          onChange={onChange}
          className="h-40"
        />
      </div>
    </PopoverContent>
  </Popover>
)
interface DeleteConfirmationProps {
  onConfirm: () => void;
}
const DeleteConfirmation: React.FC<DeleteConfirmationProps> = ({ onConfirm }) => (
  <AlertDialog>
    <AlertDialogTrigger asChild>
      <Button variant="outline" size="icon">
        <Trash2 className="h-4 w-4" />
      </Button>
    </AlertDialogTrigger>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you sure you want to delete this lens?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the lens and remove its data from our servers.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancel</AlertDialogCancel>
        <AlertDialogAction onClick={onConfirm}>Delete</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
)
interface ImageUploadDialogProps {
  lens: Lens;
  onUpload: (file: File) => void;
}
const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({ lens, onUpload }) => (
  <Dialog>
    <DialogTrigger asChild>
      <Avatar className="h-10 w-10 cursor-pointer">
        <AvatarImage src={lens.image || undefined} alt={lens.name} />
        <AvatarFallback>{lens.name.charAt(0)}</AvatarFallback>
      </Avatar>
    </DialogTrigger>
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Upload Image for {lens.name}</DialogTitle>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="picture" className="text-right">
            Picture
          </Label>
          <Input
            id="picture"
            type="file"
            accept="image/*"
            onChange={(e) => {
              if (e.target.files && e.target.files[0]) {
                onUpload(e.target.files[0])
              }
            }}
            className="col-span-3"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="submit" onClick={() => document.querySelector('dialog')?.close()}>Upload</Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)
interface LensCardProps {
  lens: Lens;
  index: number;
  handleDisplayToggle: (id: number) => void;
  handleLensInputChange: (id: number, field: keyof Lens, value: string | number) => void;
  handleCopyLens: (id: number) => void;
  handleMoveLens: (id: number, direction: 'up' | 'down') => void;
  handleDeleteLens: (id: number) => void;
}
const LensCard: React.FC<LensCardProps> = ({ 
  lens, 
  index, 
  handleDisplayToggle, 
  handleLensInputChange, 
  handleCopyLens, 
  handleMoveLens,
  handleDeleteLens
}) => (
  <Card className="mb-4 test">
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center justify-between">
        <span className="flex items-center">
          <ImageUploadDialog 
            lens={lens} 
            onUpload={(file) => handleImageUpload(lens.id, file)} 
          />
          <span className="ml-2">{lens.name}</span>
        </span>
        <div>
          <Switch className="mr-2"
            checked={lens.display} 
            onCheckedChange={() => handleDisplayToggle(lens.id)}
          />
          <Switch 
            checked={lens.display} 
            onCheckedChange={() => handleDisplayToggle(lens.id)}
          />
        </div>
        
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="flex justify-between items-center mb-2">
        <div className="text-sm text-muted-foreground">
          Last Update: {lens.lastUpdate.toLocaleDateString()}
        </div>
        <div className="text-sm font-medium">
          Usage: {lens.usageCount} times
        </div>
      </div>
      <Accordion type="single" collapsible className="w-full">
        <AccordionItem value="item-1">
          <AccordionTrigger>Models and Tokens</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4">
              <div>
                <Label className="text-sm font-medium">Credit Consumption</Label>
                <Input 
                  type="number" 
                  value={lens.creditconsumption} 
                  onChange={(e) => handleLensInputChange(lens.id, 'creditconsumption', parseInt(e.target.value))}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Image to Text Model</Label>
                <Select 
                  value={lens.imageToTextModel} 
                  onValueChange={(value) => handleLensInputChange(lens.id, 'imageToTextModel', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="GPT-4-Vision">GPT-4-Vision</SelectItem>
                    <SelectItem value="CLIP">CLIP</SelectItem>
                    <SelectItem value="ImageBind">ImageBind</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Text to Image Model</Label>
                <Select 
                  value={lens.textToImageModel} 
                  onValueChange={(value) => handleLensInputChange(lens.id, 'textToImageModel', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="DALL-E 3">DALL-E 3</SelectItem>
                    <SelectItem value="Stable Diffusion">Stable Diffusion</SelectItem>
                    <SelectItem value="Midjourney">Midjourney</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Upscale Model</Label>
                <Select 
                  value={lens.upscaleModel} 
                  onValueChange={(value) => handleLensInputChange(lens.id, 'upscaleModel', value)}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select model" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Real-ESRGAN">Real-ESRGAN</SelectItem>
                    <SelectItem value="Waifu2x">Waifu2x</SelectItem>
                    <SelectItem value="Topaz Gigapixel">Topaz Gigapixel</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium">Max Tokens</Label>
                <Input 
                  type="number" 
                  value={lens.maxTokens} 
                  onChange={(e) => handleLensInputChange(lens.id, 'maxTokens', parseInt(e.target.value))}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-2">
          <AccordionTrigger>Prompts</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4">
              <div>
                <Label className="text-sm font-medium">Prompt</Label>
                <PromptPopover
                  value={lens.prompt}
                  onChange={(e) => handleLensInputChange(lens.id, 'prompt', e.target.value)}
                  title="Edit Prompt"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Style Prompt</Label>
                <PromptPopover
                  value={lens.stylePrompt}
                  onChange={(e) => handleLensInputChange(lens.id, 'stylePrompt', e.target.value)}
                  title="Edit Style Prompt"
                />
              </div>
              <div>
                <Label className="text-sm font-medium">Negative Prompt</Label>
                <PromptPopover
                  value={lens.negativePrompt}
                  onChange={(e) => handleLensInputChange(lens.id, 'negativePrompt', e.target.value)}
                  title="Edit Negative Prompt"
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value="item-3">
          <AccordionTrigger>Settings</AccordionTrigger>
          <AccordionContent>
            <div className="grid gap-4">
              <div>
                <Label className="text-sm font-medium">Steps: {lens.steps}</Label>
                <Slider 
                  value={[lens.steps]}
                  min={1}
                  max={100}
                  step={1}
                  onValueChange={(value) => handleLensInputChange(lens.id, 'steps', value[0])}
                />
              </div>
              <div>
                <Label className="text-sm font-medium">CFG Scale: {lens.cfgScale}</Label>
                <Slider 
                  value={[lens.cfgScale]}
                  min={1}
                  max={20}
                  step={0.1}
                  onValueChange={(value) => handleLensInputChange(lens.id, 'cfgScale', value[0])}
                />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
      <div className="flex justify-between mt-4">
        <Button variant="outline" size="sm" onClick={() => handleCopyLens(lens.id)}>
          <Copy className="h-4 w-4 mr-2" />
          Copy
        </Button>
        <DeleteConfirmation onConfirm={() => handleDeleteLens(lens.id)} />
        <Button variant="outline" size="sm" onClick={() => handleMoveLens(lens.id, 'up')} disabled={index === 0}>
          <MoveUp className="h-4 w-4 mr-2" />
          Up
        </Button>
        <Button variant="outline" size="sm" onClick={() => handleMoveLens(lens.id, 'down')} disabled={index === lenses.length - 1}>
          <MoveDown className="h-4 w-4 mr-2" />
          Down
        </Button>
      </div>
    </CardContent>
  </Card>
)

return (
  
  <div className="container mx-auto py-6 px-4 sm:px-6 lg:px-8 margin-top">
    {/* <div className="flex justify-between items-center mb-6">
      <h1 className="text-2xl font-bold flex items-center">
        <Camera className="h-6 w-6 mr-2" />
        AI Lens Dashboard
      </h1>
      {isLoggedIn ? (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline">{email}</Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onClick={handleLogout}>Logout</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ) : (
        <Dialog>
          <DialogTrigger asChild>
            <Button>Login</Button>
          </DialogTrigger>
          <DialogContent>
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
                    value={email}
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
                    value={password}
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
    </div> */}
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
          <div className="mb-6 custom-flex">
            <Label htmlFor="systemPrompt" className="text-lg font-medium">System Prompt</Label>
            <Textarea
              id="systemPrompt"
              value={systemPrompt}
              onChange={(e) => setSystemPrompt(e.target.value)}
              placeholder="Enter system prompt here..."
              className=""
            />
            <Button onClick={handleRefresh} disabled={isLoading}>
              {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Submit"}
            </Button>
            
          </div>
          <div className="flex justify-end mb-4">
        {/* <Button onClick={handleRefresh} disabled={isLoading}>
          {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Refresh"}
        </Button> */}
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Refresh Lenses</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleModalSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="email" className="text-right">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">
                  Description
                </Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">
                  Category
                </Label>
                <Select onValueChange={handleSelectChange} value={formData.category}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="option1">Option 1</SelectItem>
                    <SelectItem value="option2">Option 2</SelectItem>
                    <SelectItem value="option3">Option 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="subscribe" className="text-right">
                  Subscribe
                </Label>
                <Checkbox
                  id="subscribe"
                  name="subscribe"
                  checked={formData.subscribe}
                  onCheckedChange={(checked) => setFormData(prev => ({ ...prev, subscribe: checked as boolean }))}
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label className="text-right">Preference</Label>
                <RadioGroup
                  onValueChange={handleRadioChange}
                  value={formData.preference}
                  className="col-span-3"
                >
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option1" id="option1" />
                    <Label htmlFor="option1">Option 1</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem value="option2" id="option2" />
                    <Label htmlFor="option2">Option 2</Label>
                  </div>
                </RadioGroup>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="attachment" className="text-right">
                  Attachment
                </Label>
                <Input
                  id="attachment"
                  name="attachment"
                  type="file"
                  onChange={handleFileChange}
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="submit">Submit</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Lens Data</h2>
              <div className="space-x-2">
                <Button variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Lens Data
                </Button>
                <ModelDropdown onSelect={handleModelSelect} />
              </div>
            </div>
            <div className="flex justify-between items-center mb-4">
              <Select value={entriesPerPage} onValueChange={setEntriesPerPage}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Entries per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-8"
                />
              </div>
            </div>
          </div>
          {/* Mobile view */}
          <div className="md:hidden">
            {displayedLenses.map((lens, index) => (
              <LensCard 
                key={lens.id} 
                lens={lens} 
                index={index}
                handleDisplayToggle={handleDisplayToggle}
                handleLensInputChange={handleLensInputChange}
                handleCopyLens={handleCopyLens}
                handleMoveLens={handleMoveLens}
                handleDeleteLens={handleDeleteLens}
              />
            ))}
          </div>
          
          {/* Desktop view */}
          <div className="hidden md:block overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[50px]">No</TableHead>
                  <TableHead>Lens Icon</TableHead>
                  <TableHead>Lens Name</TableHead>
                  <TableHead>Display</TableHead>
                  <TableHead>Premium Lens</TableHead>
                  <TableHead>Credit Consumption</TableHead>
                  <TableHead>Image to Text Model</TableHead>
                  <TableHead>Max Tokens</TableHead>
                  <TableHead>Text to Image Model</TableHead>
                  <TableHead>Upscale Model</TableHead>
                  <TableHead>Prompt</TableHead>
                  <TableHead>Style Prompt</TableHead>
                  <TableHead>Negative Prompt</TableHead>
                  <TableHead>Steps</TableHead>
                  <TableHead>CFG Scale</TableHead>
                  <TableHead>Usage Count</TableHead>
                  <TableHead>Last Update</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayedLenses.map((lens, index) => (
                  <TableRow key={lens.id}>
                    <TableCell>{index + 1}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <ImageUploadDialog 
                          lens={lens} 
                          onUpload={(file) => handleImageUpload(lens.id, file)} 
                        />
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <span className="ml-2 font-medium">{lens.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={lens.display} 
                        onCheckedChange={() => handleDisplayToggle(lens.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Switch 
                        checked={lens.display} 
                        onCheckedChange={() => handleDisplayToggle(lens.id)}
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                       type="number" 
                       value={lens.creditconsumption} 
                       onChange={(e) => handleLensInputChange(lens.id, 'creditconsumption', parseInt(e.target.value))}
                        className="w-[100px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={lens.imageToTextModel} 
                        onValueChange={(value) => handleLensInputChange(lens.id, 'imageToTextModel', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="GPT-4-Vision">GPT-4-Vision</SelectItem>
                          <SelectItem value="CLIP">CLIP</SelectItem>
                          <SelectItem value="ImageBind">ImageBind</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={lens.maxTokens} 
                        onChange={(e) => handleLensInputChange(lens.id, 'maxTokens', parseInt(e.target.value))}
                        className="w-[100px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={lens.textToImageModel} 
                        onValueChange={(value) => handleLensInputChange(lens.id, 'textToImageModel', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DALL-E 3">DALL-E 3</SelectItem>
                          <SelectItem value="Stable Diffusion">Stable Diffusion</SelectItem>
                          <SelectItem value="Midjourney">Midjourney</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Select 
                        value={lens.upscaleModel} 
                        onValueChange={(value) => handleLensInputChange(lens.id, 'upscaleModel', value)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select model" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Real-ESRGAN">Real-ESRGAN</SelectItem>
                          <SelectItem value="Waifu2x">Waifu2x</SelectItem>
                          <SelectItem value="Topaz Gigapixel">Topaz Gigapixel</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <PromptPopover
                        value={lens.prompt}
                        onChange={(e) => handleLensInputChange(lens.id, 'prompt', e.target.value)}
                        title="Edit Prompt"
                      />
                    </TableCell>
                    <TableCell>
                      <PromptPopover
                        value={lens.stylePrompt}
                        onChange={(e) => handleLensInputChange(lens.id, 'stylePrompt', e.target.value)}
                        title="Edit Style Prompt"
                      />
                    </TableCell>
                    <TableCell>
                      <PromptPopover
                        value={lens.negativePrompt}
                        onChange={(e) => handleLensInputChange(lens.id, 'negativePrompt', e.target.value)}
                        title="Edit Negative Prompt"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={lens.steps} 
                        onChange={(e) => handleLensInputChange(lens.id, 'steps', parseInt(e.target.value))}
                        className="w-[80px]"
                      />
                    </TableCell>
                    <TableCell>
                      <Input 
                        type="number" 
                        value={lens.cfgScale} 
                        onChange={(e) => handleLensInputChange(lens.id, 'cfgScale', parseFloat(e.target.value))}
                        className="w-[80px]"
                      />
                    </TableCell>
                    <TableCell>{lens.usageCount}</TableCell>
                    <TableCell>{lens.lastUpdate.toLocaleDateString()}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="icon" onClick={() => handleCopyLens(lens.id)}>
                          <Copy className="h-4 w-4" />
                        </Button>
                        <DeleteConfirmation onConfirm={() => handleDeleteLens(lens.id)} />
                        <Button variant="outline" size="icon" onClick={() => handleMoveLens(lens.id, 'up')} disabled={index === 0}>
                          <MoveUp className="h-4 w-4" />
                        </Button>
                        <Button variant="outline" size="icon" onClick={() => handleMoveLens(lens.id, 'down')} disabled={index === lenses.length - 1}>
                          <MoveDown className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </>
      )}
    </div>
  )
}