'use client'

import { useState, useRef, useEffect, useCallback  } from 'react'
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
import { ModelDropdown } from './model-dropdown'
import { log } from 'console'

// Utility function for decryption
async function decryptField(encryptedData: string): Promise<string> {
  try {
    const { key, iv, encryptedData: encData } = JSON.parse(encryptedData);

    // Convert hex strings to Uint8Array
    const keyBuffer = new Uint8Array(key.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
    const ivBuffer = new Uint8Array(iv.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));
    const encryptedBuffer = new Uint8Array(encData.match(/.{1,2}/g)!.map((byte: string) => parseInt(byte, 16)));

    // Import the key
    const importedKey = await window.crypto.subtle.importKey(
      "raw",
      keyBuffer,
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    );

    // Decrypt the data
    const decryptedBuffer = await window.crypto.subtle.decrypt(
      { name: "AES-CBC", iv: ivBuffer },
      importedKey,
      encryptedBuffer
    );

    // Convert the decrypted buffer to a string
    const decoder = new TextDecoder();
    return decoder.decode(decryptedBuffer);
  } catch (error) {
    console.error("Decryption failed:", error);
    return ""; // Return an empty string or handle the error as needed
  }
}

type Lens = {
  id: number;
  lensId: string; // New field for the lens ID
  name: string;
  display: boolean;
  premiumLens: boolean;
  creditconsumption: number;
  promptgenerationflow: string;
  imageToTextModel: string;
  maxTokens: number;
  textToImageModel: string;
  lastUpdate: Date;
  prompt: string;
  stylePrompt: string;
  negativePrompt: string;
  Aproxtime: string;
  steps: number;
  cfgScale: number;
  image: string | null;
  usageCount: number;
}; 

  export function AiLensDashboard() {
    const [lenses, setLenses] = useState<Lens[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [systemPrompt, setSystemPrompt] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [entriesPerPage, setEntriesPerPage] = useState("All")
    const [searchQuery, setSearchQuery] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
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
    const [editingId, setEditingId] = useState<number | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [editingAproxTimeId, setEditingAproxTimeId] = useState<number | null>(null);
  
    useEffect(() => {
      fetchLensData();
    }, []);
  
    const fetchLensData = async () => {
      setIsLoading(true);
      try {
        const response = await fetch('https://dashboard.flashailens.com/api/dashboard/getAllData');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        if (!result.data || !Array.isArray(result.data)) {
          console.error('API response is not in the expected format:', result);
          throw new Error('API response is not in the expected format');
        }
  
        const formattedLenses: Lens[] = await Promise.all(result.data.map(async (item: any) => {
          const decryptIfNeeded = async (value: any) => {
            if (typeof value === 'string' && value.startsWith('{')) {
              return await decryptField(value);
            }
            return value;
          };
  
          return {
            id: item._id || '',
            lensId: item.lensId || '',
            name: await decryptIfNeeded(item.lensName) || '',
            display: item.display || false,
            premiumLens: item.premiumLens || false,
            creditconsumption: parseInt(await decryptIfNeeded(item.lensCredit)) || 0,
            promptgenerationflow: await decryptIfNeeded(item.promptFlow) || '',
            imageToTextModel: await decryptIfNeeded(item.model) || '',
            maxTokens: parseInt(await decryptIfNeeded(item.maxTokens)) || 0,
            textToImageModel: await decryptIfNeeded(item.imageModel) || '',
            lastUpdate: new Date(item.updatedAt || Date.now()),
            prompt: await decryptIfNeeded(item.prompt) || '',
            stylePrompt: await decryptIfNeeded(item.stylePrompt) || '',
            negativePrompt: await decryptIfNeeded(item.negativePrompt) || '',
            Aproxtime: await decryptIfNeeded(item.approxTime) || '',
            steps: parseInt(await decryptIfNeeded(item.civitaiSteps)) || 0,
            cfgScale: parseFloat(await decryptIfNeeded(item.civitaiCFGScale)) || 0,
            image: item.image || null,
            usageCount: parseInt(await decryptIfNeeded(item.lensUses)) || 0
          };
        }));
  
        setLenses(formattedLenses);
        
      } catch (error) {
        console.error('Error fetching lens data:', error);
        toast({
          title: "Error",
          description: "Failed to fetch lens data. Please try again later.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
  
    // Add new handler functions for Aprox Time editing
    const handleAproxTimeEdit = (id: number) => {
      setEditingAproxTimeId(id);
    };

    const handleAproxTimeSave = (id: number, newAproxTime: string) => {
      handleLensInputChange(id, 'Aproxtime', newAproxTime);
      setEditingAproxTimeId(null);
    };


    useEffect(() => {
      if (editingId !== null && inputRef.current) {
        inputRef.current.focus();
      }
    }, [editingId]);

    const handleNameEdit = (id: number) => {
      setEditingId(id);
    };
  
    const handleNameSave = async (id: number, newName: string) => {
      setIsLoading(true);
      const formData = new FormData();
      formData.append('lensName', newName);
      try {
        const response = await fetch(`https://dashboard.flashailens.com/api/dashboard/updateData/${id}`, {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Failed to update lens name');
        }
  
        const result = await response.json();
  
        // Update the local state
        setLenses(lenses.map(lens => 
          lens.id === id ? { ...lens, name: newName } : lens
        ));
  
        setEditingId(null);
  
        toast({
          title: "Success",
          description: "Lens name updated successfully",
        });
      } catch (error) {
        console.error('Error updating lens name:', error);
        toast({
          title: "Error",
          description: "Failed to update lens name. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

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
      lens.prompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lens.stylePrompt.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lens.negativePrompt.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const totalPages = entriesPerPage === "All" 
    ? 1 
    : Math.ceil(filteredLenses.length / parseInt(entriesPerPage))

  const displayedLenses = entriesPerPage === "All" 
    ? filteredLenses 
    : filteredLenses.slice(
        (currentPage - 1) * parseInt(entriesPerPage), 
        currentPage * parseInt(entriesPerPage)
      )
      const handleEntriesPerPageChange = (value: string) => {
        setEntriesPerPage(value)
        setCurrentPage(1)
      }

      const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value)
        setCurrentPage(1)
      }

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

    const handleDisplayToggle = useCallback((id: number) => {
      setLenses(prevLenses => prevLenses.map(lens => 
        lens.id === id ? { ...lens, display: !lens.display } : lens
      ))
    }, [])
  
    const handleDisplayToggles = useCallback((id: number) => {
      setLenses(prevLenses => prevLenses.map(lens => 
        lens.id === id ? { ...lens, premiumLens: !lens.premiumLens } : lens
      ))
    }, [])

    const handleLensInputChange = (id: number, field: keyof Lens, value: string | number) => {
      if (field === 'promptgenerationflow') {
        handlePromptGenerationFlowChange(id, value as string);
      } else {
        setLenses(lenses.map(lens => 
          lens.id === id ? { ...lens, [field]: value } : lens
        ));
      }
    };
    
    const handlePromptGenerationFlowChange = async (id: number, value: string) => {
      const lens = lenses.find(l => l.id === id);
      if (!lens) {
        console.error('Lens not found');
        return;
      }
      console.log(lens);
      try {
        const response = await fetch(`https://dashboard.flashailens.com/api/dashboard/updatePromptFlow`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ 
            promptFlow: value,
            lensId: lens.lensId // Use the lensId from the lens object
          }),
        });
  
        if (!response.ok) {
          throw new Error('Failed to update Prompt Generation Flow');
        }
  
        const result = await response.json();
  
        // Update the local state
        setLenses(lenses.map(l => 
          l.id === id ? { ...l, promptgenerationflow: value } : l
        ));
  
        toast({
          title: "Success",
          description: "Prompt Generation Flow updated successfully",
        });
      } catch (error) {
        console.error('Error updating Prompt Generation Flow:', error);
        toast({
          title: "Error",
          description: "Failed to update Prompt Generation Flow. Please try again.",
          variant: "destructive",
        });
      }
    };
  
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

    const handleImageUpload = async (id: number, file: File) => {
      const formData = new FormData();
      formData.append('image', file);
      try {
        const response = await fetch(`https://dashboard.flashailens.com/api/dashboard/updateData/${id}`, {
          method: 'POST',
          body: formData,
        });
  
        if (!response.ok) {
          throw new Error('Failed to upload image');
        }
  
        const result = await response.json();
        
        // Update the lens state with the new image URL
        // setLenses(lenses.map(lens => 
        //   lens.id === id ? { ...lens, image: result.image } : lens
        // ));
        const reader = new FileReader()
        reader.onload = (e) => {
          setLenses(lenses.map(lens => 
            lens.id === id ? { ...lens, image: e.target?.result as string | null } : lens
          ))
        }
        reader.readAsDataURL(file);
        // Toast message is now handled in the ImageUploadDialog component
      } catch (error) {
        console.error('Error uploading image:', error);
        throw error; // Rethrow the error to be handled in the ImageUploadDialog
      }
    };

    interface PromptPopoverProps {
      value: string;
      onChange: (value: string) => void;
      title: string;
    }

    const PromptPopover: React.FC<PromptPopoverProps> = ({ value, onChange, title }) => {
      const [isOpen, setIsOpen] = useState(false);
      const [tempValue, setTempValue] = useState(value);
    
      const handleOpen = () => {
        setTempValue(value);
        setIsOpen(true);
      };
    
      const handleClose = () => {
        setIsOpen(false);
      };
    
      const handleSave = () => {
        onChange(tempValue);
        handleClose();
      };
    
      return (
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Textarea
              className="max-width w-[250px] truncate resize-none latest-bio cursor-pointer" // Set fixed width and height for the textarea
              onClick={handleOpen} // Open popover on click
              readOnly // Make the textarea read-only so it acts as a trigger
              value={value || "Edit prompt"}
            />
          </PopoverTrigger>
          <PopoverContent className="w-[600px] mobile-de">
            <div className="grid gap-4">
              <h4 className="font-medium leading-none">{title}</h4>
              <Textarea
                value={tempValue}
                onChange={(e) => setTempValue(e.target.value)}
                className="w-12/12 latestes resize-none" // Keep the content fixed
              />
              <div className="flex justify-end space-x-2">
                <Button variant="outline" onClick={handleClose}>Cancel</Button>
                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          </PopoverContent>
        </Popover>
      );
    };
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
    onUpload: (id: number, file: File) => Promise<void>;
  }
  const ImageUploadDialog: React.FC<ImageUploadDialogProps> = ({ lens, onUpload }) => {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [isUploading, setIsUploading] = useState(false);
  
    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
        setSelectedFile(e.target.files[0]);
      }
    };
  
    const handleUpload = async () => {
      if (selectedFile) {
        setIsUploading(true);
        try {
          await onUpload(lens.id, selectedFile);
          setSelectedFile(null);
          toast({
            title: "Success",
            description: "Image uploaded successfully",
          });
        } catch (error) {
          console.error('Error uploading image:', error);
          toast({
            title: "Error",
            description: "Failed to upload image. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsUploading(false);
        }
      }
    };
  
    return (
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
                onChange={handleFileSelect}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleUpload} disabled={!selectedFile || isUploading}>
              {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  };
  interface LensCardProps {
    lens: Lens;
    index: number;
    handleDisplayToggle: (id: number) => void;
    handleDisplayToggles: (id: number) => void;
    handleLensInputChange: (id: number, field: keyof Lens, value: string | number) => void;
    handleCopyLens: (id: number) => void;
    handleMoveLens: (id: number, direction: 'up' | 'down') => void;
    handleDeleteLens: (id: number) => void;
    handleNameEdit: (id: number) => void;
    handleNameSave: (id: number, newName: string) => void;
    editingId: number | null;
  }
  const LensCard: React.FC<LensCardProps> = ({ 
    lens, 
    index, 
    handleDisplayToggle, 
    handleDisplayToggles, 
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
              onUpload={handleImageUpload} 
            />
            {editingId === lens.id ? (
            <Input
              ref={inputRef}
              value={lens.name}
              onChange={(e) => handleLensInputChange(lens.id, 'name', e.target.value)}
              onBlur={() => handleNameSave(lens.id, lens.name)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleNameSave(lens.id, lens.name);
                }
              }}
              className="ml-2 w-full"
            />
          ) : (
            <span
              className="ml-2 font-medium cursor-pointer"
              onClick={() => handleNameEdit(lens.id)}
            >
              {lens.name}
            </span>
          )}
          </span>
          <div>
            <Switch className="mr-2"
              checked={lens.display} 
              onCheckedChange={() => handleDisplayToggle(lens.id)}
            />
            <Switch 
              checked={lens.premiumLens} 
              onCheckedChange={() => handleDisplayToggles(lens.id)}
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
                  <Label className="text-sm font-medium">  Prompt Generation Flow</Label>
                  <Select 
                    value={lens.promptgenerationflow} 
                    onValueChange={(value) => handleLensInputChange(lens.id, 'promptgenerationflow', value)}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select model" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Flow B">Flow B</SelectItem>
                      <SelectItem value="Flow C">Flow C</SelectItem>
                    </SelectContent>
                  </Select>
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
                      <SelectItem value="claude-3-opus-20240229">claude-3-opus</SelectItem>
                      <SelectItem value="claude-3-haiku-20240307">claude-3-haiku</SelectItem>
                      <SelectItem value="claude-3-sonnet-20240229">claude-3-sonnet</SelectItem>
                      <SelectItem value="claude-3-5-sonnet-20240620">claude-3-5-sonnet</SelectItem>
                      <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                      <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                      <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
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
                      <SelectItem value="sd3">sd3</SelectItem>
                      <SelectItem value="sd3-large-turbo">sd3-large-turbo</SelectItem>
                      <SelectItem value="sd3-large">sd3-large</SelectItem>
                      <SelectItem value="core">core</SelectItem>
                      <SelectItem value="sdxl-1.0">sdxl-1.0</SelectItem>
                      <SelectItem value="sd-1.6">sd-1.6</SelectItem>
                      <SelectItem value="dall-e-3">dall-e-3</SelectItem>
                      <SelectItem value="Dreamshaper XL">Dreamshaper XL</SelectItem>
                      <SelectItem value="Anime model">Animagine XL</SelectItem>
                      <SelectItem value="Juggernaut-XL">Juggernaut XL</SelectItem>
                      <SelectItem  value="flux-dev">flux-dev</SelectItem>
                      <SelectItem  value="flux-schnell">flux-schnell</SelectItem>
                      <SelectItem  value="flux-pro">flux-pro</SelectItem>
                      <SelectItem  value="flux-realism">flux-realism</SelectItem>
                      <SelectItem  value="face-Gen">face-Gen</SelectItem>
                      <SelectItem  value="replicate-flux-schnell">replicate-flux-schnell</SelectItem>
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
                    onChange={(value) => handleLensInputChange(lens.id, 'prompt', value)}
                    title="Edit Prompt"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Style Prompt</Label>
                  <PromptPopover
                    value={lens.stylePrompt}
                    onChange={(value) => handleLensInputChange(lens.id, 'stylePrompt', value)}
                    title="Edit Style Prompt"
                  />
                </div>
                <div>
                  <Label className="text-sm font-medium">Negative Prompt</Label>
                  <PromptPopover
                    value={lens.negativePrompt}
                    onChange={(value) => handleLensInputChange(lens.id, 'negativePrompt', value)}
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
                <div>
                  <Label className="text-sm font-medium">Aprox Time</Label>
                  {editingAproxTimeId === lens.id ? (
                            <Input
                              value={lens.Aproxtime}
                              onChange={(e) => handleLensInputChange(lens.id, 'Aproxtime', e.target.value)}
                              onBlur={() => handleAproxTimeSave(lens.id, lens.Aproxtime)}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  handleAproxTimeSave(lens.id, lens.Aproxtime);
                                }
                              }}
                              className="w-full"
                            />
                          ) : (
                            <span
                              className="font-medium w-full block cursor-pointer"
                              onClick={() => handleAproxTimeEdit(lens.id)}
                            >
                              {lens.Aproxtime}
                            </span>
                          )}
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
            <div className="mt-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Lens Data</h2>
              <div className="space-x-2">
                <ModelDropdown onSelect={handleModelSelect} />
              </div>
            </div>
            <div className="flex flex-col sm:flex-row justify-between items-center mb-4">
              <Select value={entriesPerPage} onValueChange={handleEntriesPerPageChange}>
                <SelectTrigger className="w-full sm:w-[180px] mb-2 sm:mb-0">
                  <SelectValue placeholder="Entries per page" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <div className="relative w-full sm:w-auto">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="text"
                  placeholder="Search..."
                  value={searchQuery}
                  onChange={handleSearchChange}
                  className="pl-8 w-full"
                />
              </div>
            </div>
          </div>
            {isLoading ? (
            <div className="flex justify-center items-center h-64">
              <Loader2 className="h-8 w-8 animate-spin" />
            </div>
          ) : (
            <>
              {/* Mobile view */}
              <div className="md:hidden">
                {lenses.map((lens, index) => (
                  <LensCard 
                    key={lens.id} 
                    lens={lens} 
                    index={index}
                    handleDisplayToggle={handleDisplayToggle}
                    handleDisplayToggles={handleDisplayToggles}
                    handleLensInputChange={handleLensInputChange}
                    handleCopyLens={handleCopyLens}
                    handleMoveLens={handleMoveLens}
                    handleDeleteLens={handleDeleteLens}
                    handleNameEdit={handleNameEdit}
                    handleNameSave={handleNameSave}
                    editingId={editingId}
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
                        <TableHead className='text-center'>Lens Name</TableHead>
                        <TableHead>Display</TableHead>
                        <TableHead>Premium Lens</TableHead>
                        <TableHead>Credit Consumption</TableHead>
                        <TableHead>Prompt Generation Flow</TableHead>
                        <TableHead>Image to Text Model</TableHead>
                        <TableHead>Max Tokens</TableHead>
                        <TableHead>Text to Image Model</TableHead>
                        <TableHead>Prompt</TableHead>
                        <TableHead>Style Prompt</TableHead>
                        <TableHead>Negative Prompt</TableHead>
                        <TableHead>Steps</TableHead>
                        <TableHead>CFG Scale</TableHead>
                        <TableHead>Aprox Time</TableHead>
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
                            <div className="flex items-center w-[65px]">
                              
                              <ImageUploadDialog 
                                  lens={lens} 
                                  onUpload={handleImageUpload} 
                                />
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="text-center  w-[150px] wi-conent">
                              {editingId === lens.id ? (
                                <Input
                                  ref={inputRef}
                                  value={lens.name}
                                  onChange={(e) => handleLensInputChange(lens.id, 'name', e.target.value)}
                                  onBlur={() => handleNameSave(lens.id, lens.name)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleNameSave(lens.id, lens.name);
                                    }
                                  }}
                                  className="w-full"
                                />
                              ) : (
                                <span
                                  className="text-center font-medium cursor-pointer"
                                  onClick={() => handleNameEdit(lens.id)}
                                >
                                  {lens.name}
                                </span>
                              )}
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
                              checked={lens.premiumLens} 
                              onCheckedChange={() => handleDisplayToggles(lens.id)}
                            />
                          </TableCell>
                          <TableCell>
                            <Input 
                            type="number" 
                            value={lens.creditconsumption} 
                            onChange={(e) => handleLensInputChange(lens.id, 'creditconsumption', parseInt(e.target.value))}
                              className="w-[150px]"
                            />
                          </TableCell>
                          <TableCell>
                          <Select 
                              value={lens.promptgenerationflow} 
                              onValueChange={(value) => handleLensInputChange(lens.id, 'promptgenerationflow', value)}
                            >
                              <SelectTrigger className="w-full w-[180px]">
                                <SelectValue placeholder="Select model" />
                              </SelectTrigger>
                              <SelectContent>
        
                                <SelectItem value="Flow B">Flow B</SelectItem>
                                <SelectItem value="Flow C">Flow C</SelectItem>
                              </SelectContent>
                            </Select>
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
                                <SelectItem value="claude-3-opus-20240229">claude-3-opus</SelectItem>
                                <SelectItem value="claude-3-haiku-20240307">claude-3-haiku</SelectItem>
                                <SelectItem value="claude-3-sonnet-20240229">claude-3-sonnet</SelectItem>
                                <SelectItem value="claude-3-5-sonnet-20240620">claude-3-5-sonnet</SelectItem>
                                <SelectItem value="gpt-4o">gpt-4o</SelectItem>
                                <SelectItem value="gpt-4o-mini">gpt-4o-mini</SelectItem>
                                <SelectItem value="gpt-4-turbo">gpt-4-turbo</SelectItem>
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
                                <SelectItem value="sd3">sd3</SelectItem>
                                <SelectItem value="sd3-large-turbo">sd3-large-turbo</SelectItem>
                                <SelectItem value="sd3-large">sd3-large</SelectItem>
                                <SelectItem value="core">core</SelectItem>
                                <SelectItem value="sdxl-1.0">sdxl-1.0</SelectItem>
                                <SelectItem value="sd-1.6">sd-1.6</SelectItem>
                                <SelectItem value="dall-e-3">dall-e-3</SelectItem>
                                <SelectItem value="Dreamshaper XL">Dreamshaper XL</SelectItem>
                                <SelectItem value="Anime model">Animagine XL</SelectItem>
                                <SelectItem value="Juggernaut-XL">Juggernaut XL</SelectItem>
                                <SelectItem  value="flux-dev">flux-dev</SelectItem>
                                <SelectItem  value="flux-schnell">flux-schnell</SelectItem>
                                <SelectItem  value="flux-pro">flux-pro</SelectItem>
                                <SelectItem  value="flux-realism">flux-realism</SelectItem>
                                <SelectItem  value="face-Gen">face-Gen</SelectItem>
                                <SelectItem  value="replicate-flux-schnell">replicate-flux-schnell</SelectItem>
                              </SelectContent>
                            </Select>
                          </TableCell>
                          <TableCell>
                            <PromptPopover
                              value={lens.prompt}
                              onChange={(value) => handleLensInputChange(lens.id, 'prompt', value)}
                              title="Edit Prompt"
                            />
                          </TableCell>
                          <TableCell>
                            <PromptPopover
                              value={lens.stylePrompt}
                              onChange={(value) => handleLensInputChange(lens.id, 'stylePrompt', value)}
                              title="Edit Style Prompt"
                            />
                          </TableCell>
                          <TableCell>
                            <PromptPopover
                              value={lens.negativePrompt}
                              onChange={(value) => handleLensInputChange(lens.id, 'negativePrompt', value)}
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
                          <TableCell>
                            <div className="flex justify-items-center items-center w-[80px]">
                              {editingAproxTimeId === lens.id ? (
                                <Input
                                  value={lens.Aproxtime}
                                  onChange={(e) => handleLensInputChange(lens.id, 'Aproxtime', e.target.value)}
                                  onBlur={() => handleAproxTimeSave(lens.id, lens.Aproxtime)}
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      handleAproxTimeSave(lens.id, lens.Aproxtime);
                                    }
                                  }}
                                  className="w-full"
                                />
                              ) : (
                                <span
                                  className="text-center font-medium cursor-pointer"
                                  onClick={() => handleAproxTimeEdit(lens.id)}
                                >
                                  {lens.Aproxtime}
                                </span>
                              )}
                            </div>
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
                {/* Pagination */}
              {entriesPerPage !== "All" && (
                <div className="flex justify-center mt-4 align-items-center">
                  <Button
                    variant="outline" 
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="mx-4">
                    Page {currentPage} of {totalPages}
                  </span>
                  <Button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </Button>
                </div>
              )}
              </>
            )}
          </>
        )}
      </div>
    )
  }