import React, { useState, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Plus } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ModelDropdownProps {
  onSelect: (option: string) => void
}

interface PromptAPIResponse {
  message: string;
  data: {
    _id: string;
    prompt: string;
    systemPrompt: string;
    generalSystemPrompt: string;
  };
}

interface NegativeKeyword {
  _id?: string;
  negativeKeyword: string;
}

interface NegativeKeywordAPIResponse {
  message: string;
  data: NegativeKeywordData[];
}

interface NegativeKeywordData {
  _id: string;
  negativeKeyword: string;
  isDeleted: boolean;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface FirebaseUserAPIResponse {
  message: string;
  data: {
    _id: string;
    freeMultiImage: string;
    freeUserLimit: string;
    proMultiImage: string;
    proUerLimit: string;
    isLive: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
    __v: number;
    civitaiAPIKey: string;
    freeTryLimit: string;
    proUserExtraCredit: string;
    productionUrl: string;
    stageUrl: string;
  };
}

// Define modal components outside of ModelDropdown

interface NegativeKeywordsModalProps {
  negativeKeywords: NegativeKeyword[];
  currentKeyword: string;
  setCurrentKeyword: React.Dispatch<React.SetStateAction<string>>;
  addKeyword: () => void;
  removeKeyword: (index: number) => void;
  updateKeyword: (index: number, newValue: string) => void;
}

const NegativeKeywordsModal: React.FC<NegativeKeywordsModalProps> = ({
  negativeKeywords,
  currentKeyword,
  setCurrentKeyword,
  addKeyword,
  removeKeyword,
  updateKeyword,
}) => (
  <div className="grid gap-4">
    {negativeKeywords.map((keywordObj, index) => (
      <div key={keywordObj._id || index} className="flex items-center justify-between">
        <div className="flex-1">
          {/* Display _id for reference */}
          {/* {keywordObj._id && <Label>ID: {keywordObj._id}</Label>} */}
          <Input
            value={keywordObj.negativeKeyword}
            onChange={(e) => updateKeyword(index, e.target.value)}
          />
        </div>
        <Button onClick={() => removeKeyword(index)} variant="destructive" size="sm" className='ml-1'>
          Remove
        </Button>
      </div>
    ))}
    <div className="flex items-center gap-2">
      <Input
        value={currentKeyword}
        onChange={(e) => setCurrentKeyword(e.target.value)}
        placeholder="Enter keyword"
        onKeyPress={(e) => e.key === 'Enter' && addKeyword()}
      />
      <Button onClick={addKeyword}>Add</Button>
    </div>
  </div>
);


interface SystemPromptModalProps {
  systemPrompt: string;
  setSystemPrompt: React.Dispatch<React.SetStateAction<string>>;
}

const SystemPromptModal: React.FC<SystemPromptModalProps> = ({
  systemPrompt,
  setSystemPrompt,
}) => (
  <div className="grid gap-4">
    <Textarea
      value={systemPrompt}
      onChange={(e) => setSystemPrompt(e.target.value)}
      placeholder="Enter system prompt"
      className="min-h-[200px]"
    />
  </div>
);

interface RemixPromptModalProps {
  remixPrompt: string;
  setRemixPrompt: React.Dispatch<React.SetStateAction<string>>;
  remixSystemPrompt: string;
  setRemixSystemPrompt: React.Dispatch<React.SetStateAction<string>>;
}

const RemixPromptModal: React.FC<RemixPromptModalProps> = ({
  remixPrompt,
  setRemixPrompt,
  remixSystemPrompt,
  setRemixSystemPrompt,
}) => (
  <div className="grid gap-4">
    <Label className="text-left w-100">
      Remix Prompt
    </Label>
    <Textarea
      value={remixPrompt}
      onChange={(e) => setRemixPrompt(e.target.value)}
      placeholder="Enter remix prompt"
      className="min-h-[150px]"
    />
    <Label className="text-left w-100">
      Remix System Prompt
    </Label>
    <Textarea
      value={remixSystemPrompt}
      onChange={(e) => setRemixSystemPrompt(e.target.value)}
      placeholder="Enter remix system prompt"
      className="min-h-[150px]"
    />
  </div>
);

interface TestingValuesModalProps {
  testingValues: {
    [key: string]: string;
  };
  handleTestingValueChange: (key: string, value: string) => void;
}

const TestingValuesModal: React.FC<TestingValuesModalProps> = ({
  testingValues,
  handleTestingValueChange,
}) => (
  <div className="grid gap-4">
    {Object.entries(testingValues).map(([key, value]) => (
      <div key={key} className="grid grid-cols-2 items-center gap-4">
        <Label htmlFor={key}>{key}</Label>
        {key === 'isLive' ? (
          <Select value={value} onValueChange={(val) => handleTestingValueChange(key, val)}>
            <SelectTrigger id={key}>
              <SelectValue placeholder="Select..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="true">True</SelectItem>
              <SelectItem value="false">False</SelectItem>
            </SelectContent>
          </Select>
        ) : (
          <Input
            id={key}
            value={value}
            onChange={(e) => handleTestingValueChange(key, e.target.value)}
          />
        )}
      </div>
    ))}
  </div>
);

export function ModelDropdown({ onSelect }: ModelDropdownProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentModal, setCurrentModal] = useState<string | null>(null)
  // Store both _id and negativeKeyword
  const [negativeKeywords, setNegativeKeywords] = useState<NegativeKeyword[]>([])
  const [currentKeyword, setCurrentKeyword] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [remixPrompt, setRemixPrompt] = useState('')
  const [remixSystemPrompt, setRemixSystemPrompt] = useState('')
  const [testingValues, setTestingValues] = useState({
    freeMultiImage: '',
    freeUserLimit: '',
    freeTryLimit: '',
    proMultiImage: '',
    proUerLimit: '',
    proUserExtraCredit: '',
    civitaiAPIKey: '',
    productionUrl: '',
    stageUrl: '',
    isLive: 'true'
  })

  useEffect(() => {
    const fetchPromptData = async () => {
      try {
        const response = await fetch('https://flashailens.com/api/dashboard/getPromptValue');
        const data: PromptAPIResponse = await response.json();
        setSystemPrompt(data.data.generalSystemPrompt);
        setRemixPrompt(data.data.prompt);
        setRemixSystemPrompt(data.data.systemPrompt);
      } catch (error) {
        console.error('Error fetching prompt data:', error);
      }
    };

    const fetchNegativeKeywords = async () => {
      try {
        const response = await fetch('https://flashailens.com/api/dashboard/getNegativeKeywords');
        const data: NegativeKeywordAPIResponse = await response.json();
        // Store both _id and negativeKeyword
        setNegativeKeywords(data.data.map(item => ({
          _id: item._id,
          negativeKeyword: item.negativeKeyword
        })));
      } catch (error) {
        console.error('Error fetching negative keywords:', error);
      }
    };

    const fetchFirebaseUserData = async () => {
      try {
        const response = await fetch('https://flashailens.com/api/dashboard/getFirebaseUser');
        const data: FirebaseUserAPIResponse = await response.json();
        setTestingValues({
          freeMultiImage: data.data.freeMultiImage,
          freeUserLimit: data.data.freeUserLimit,
          freeTryLimit: data.data.freeTryLimit,
          proMultiImage: data.data.proMultiImage,
          proUerLimit: data.data.proUerLimit,
          proUserExtraCredit: data.data.proUserExtraCredit,
          civitaiAPIKey: data.data.civitaiAPIKey,
          productionUrl: data.data.productionUrl,
          stageUrl: data.data.stageUrl,
          isLive: data.data.isLive ? 'true' : 'false'
        });
      } catch (error) {
        console.error('Error fetching Firebase user data:', error);
      }
    };

    fetchPromptData();
    fetchNegativeKeywords();
    fetchFirebaseUserData();
  }, []);

  const options = [
    "Add Negative Keywords",
    "System Prompt",
    "Remix Prompt",
    "Update Testing And User Value"
  ]

  const handleOptionSelect = (option: string) => {
    setCurrentModal(option)
    setIsModalOpen(true)
  }

  const addKeyword = () => {
    if (currentKeyword && !negativeKeywords.some(k => k.negativeKeyword === currentKeyword)) {
      setNegativeKeywords([...negativeKeywords, { negativeKeyword: currentKeyword }])
      setCurrentKeyword('')
    }
  }

  const removeKeyword = async (index: number) => {
    const keywordToRemove = negativeKeywords[index];
    if (keywordToRemove._id) {
      // Make API call to delete the keyword from the database
      try {
        const response = await fetch(`https://flashailens.com/api/dashboard/deleteNegativeKeywords/${keywordToRemove._id}`, {
          method: 'DELETE',
        });

        if (!response.ok) {
          const errorData = await response.json();
          console.error("Error deleting negative keyword:", errorData.message || errorData);
          return;
        } else {
          console.log("Negative keyword deleted successfully");
        }
      } catch (error) {
        console.error("Error deleting negative keyword:", error);
        return;
      }
    }

    // Remove the keyword from state
    setNegativeKeywords(prevKeywords => prevKeywords.filter((_, i) => i !== index));
  }

  const handleSave = async () => {
    switch (currentModal) {
      case "Add Negative Keywords":
        try {
          const updatedModels = negativeKeywords.map(keywordObj => ({
            _id: keywordObj._id,
            modelId: keywordObj.negativeKeyword
          }));

          const response = await fetch('https://flashailens.com/api/dashboard/addNegativeKeywords', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ models: updatedModels }),
          });

          if (response.ok) {
            console.log("Negative keywords updated successfully");
            const data: NegativeKeywordAPIResponse = await response.json();
            setNegativeKeywords(data.data.map(item => ({
              _id: item._id,
              negativeKeyword: item.negativeKeyword
            })));
          } else {
            const errorData = await response.json();
            console.error("Error updating negative keywords:", errorData.message || errorData);
          }
        } catch (error) {
          console.error("Error updating negative keywords:", error);
        }
        break;
      case "System Prompt":
        try {
          const response = await fetch('https://flashailens.com/api/dashboard/updatePromptValue', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ generalSystemPrompt: systemPrompt }),
          });
  
          if (response.ok) {
            console.log("System prompt updated successfully");
          } else {
            const errorData = await response.json();
            console.error("Error updating system prompt:", errorData.message || errorData);
          }
        } catch (error) {
          console.error("Error updating system prompt:", error);
        }
        break;
      case "Remix Prompt":
        try {
          const response = await fetch('https://flashailens.com/api/dashboard/updatePromptValue', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              prompt: remixPrompt,
              systemPrompt: remixSystemPrompt,
            }),
          });
      
          if (response.ok) {
            console.log("Remix prompts updated successfully");
          } else {
            const errorData = await response.json();
            console.error("Error updating remix prompts:", errorData.message || errorData);
          }
        } catch (error) {
          console.error("Error updating remix prompts:", error);
        }
        break;
      case "Update Testing And User Value":
        try {
          const response = await fetch('https://flashailens.com/api/dashboard/updateFirebaseUserValue', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(testingValues),
          });

          if (response.ok) {
            console.log("Testing values updated successfully");
          } else {
            const errorData = await response.json();
            console.error("Error updating testing values:", errorData.message || errorData);
          }
        } catch (error) {
          console.error("Error while updating testing values:", error);
        }
        break;
    }
    onSelect(currentModal || "");
    setIsModalOpen(false);
  };

  const handleTestingValueChange = (key: string, value: string) => {
    setTestingValues((prev) => ({ ...prev, [key]: value }));
  };

  const updateKeyword = (index: number, newValue: string) => {
    setNegativeKeywords((prevKeywords) => {
      const newKeywords = [...prevKeywords];
      newKeywords[index] = { ...newKeywords[index], negativeKeyword: newValue };
      return newKeywords;
    });
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Add Model
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent>
          {options.map((option) => (
            <DropdownMenuItem key={option} onSelect={() => handleOptionSelect(option)}>
              {option}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[1000px] w-full">
          <DialogHeader>
            <DialogTitle>{currentModal}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[61vh] overflow-y-auto p-4">
            {currentModal === "Add Negative Keywords" && (
              <NegativeKeywordsModal
                negativeKeywords={negativeKeywords}
                currentKeyword={currentKeyword}
                setCurrentKeyword={setCurrentKeyword}
                addKeyword={addKeyword}
                removeKeyword={removeKeyword}
                updateKeyword={updateKeyword}
              />
            )}
            {currentModal === "System Prompt" && (
              <SystemPromptModal
                systemPrompt={systemPrompt}
                setSystemPrompt={setSystemPrompt}
              />
            )}
            {currentModal === "Remix Prompt" && (
              <RemixPromptModal
                remixPrompt={remixPrompt}
                setRemixPrompt={setRemixPrompt}
                remixSystemPrompt={remixSystemPrompt}
                setRemixSystemPrompt={setRemixSystemPrompt}
              />
            )}
            {currentModal === "Update Testing And User Value" && (
              <TestingValuesModal
                testingValues={testingValues}
                handleTestingValueChange={handleTestingValueChange}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSave}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
