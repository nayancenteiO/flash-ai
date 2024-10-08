import React, { useState, useEffect } from 'react'
import axios from 'axios';
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

interface AddFreeSubscriptionUserModalProps {
  users: { _id: string; userName: string }[];
  selectedUsers: { _id: string; userName: string }[];
  setSelectedUsers: React.Dispatch<React.SetStateAction<{ _id: string; userName: string }[]>>;
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

const AddFreeSubscriptionUserModal: React.FC<AddFreeSubscriptionUserModalProps> = ({
  users,
  selectedUsers,
  setSelectedUsers,
}) => {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [freeUsers, setFreeUsers] = useState<any[]>([]); // State to hold fetched free users
  const [removingUserId, setRemovingUserId] = useState<string | null>(null);

  useEffect(() => {
    // Fetch free users when the modal loads
    const fetchFreeUsers = async () => {
      try {
        const response = await axios.get('https://dashboard.flashailens.com/api/dashboard/getFreeUser');
        setFreeUsers(response.data.data);
        console.log(response.data.data); // Set the fetched users
      } catch (error) {
        console.error('Error fetching free users:', error);
      }
    };
  
    fetchFreeUsers();
  }, []); // Empty dependency array to run only on mount
  
  const removeUser = async (id: string) => {
    console.log('Removing user with ID:', id);
    const updatedSelectedUsers = selectedUsers.filter(user => user._id !== id);
    setSelectedUsers(updatedSelectedUsers);
    setRemovingUserId(id); // Set the user ID being removed
  
    try {
      // Send a DELETE request to the API with the user ID in the URL
      const response = await axios.delete(`https://dashboard.flashailens.com/api/dashboard/deleteFreeUser/${id}`);
  
      // Check if the response indicates success
      if (response.status !== 200) {
        // If the response is not successful, revert the state change
        setSelectedUsers(selectedUsers); // Revert to the previous state
        setRemovingUserId(null); // Clear the removing user ID
        console.error('Failed to remove user:', response.data); // Log failure message
      } else {
        console.log('User removed successfully'); // Log success message
        setRemovingUserId(null); // Clear the removing user ID
      }
    } catch (error) {
      // If an error occurs, revert the state change
      setSelectedUsers(selectedUsers); // Revert to the previous state
      setRemovingUserId(null); // Clear the removing user ID
      console.error('Error removing user:', error); // Log the error
      console.error('User with ID:', id, 'was not removed'); // Log specific error message
    }
  };
  
  // Example usage of removeUser with user ID from free users
  const handleRemoveFreeUser = (userId: string) => {
    removeUser(userId); // Call removeUser with the user ID from the free users
  };

  const handleUserSelect = async (value: string) => {
    setSelectedUserId(value);
    const userToAdd = users.find(user => user._id === value); // Updated to find user in all users
    if (userToAdd && !selectedUsers.some(u => u._id === userToAdd._id)) {
      setSelectedUsers([...selectedUsers, userToAdd]);
      
      // Send selected user data to the API
      await axios.post('https://dashboard.flashailens.com/api/dashboard/addFreeUser', {
        models : [{ _id: "", userName: userToAdd.userName }]
      });
    }
    setSelectedUserId(''); // Reset the selection
  };

  return (
    <div className="grid gap-4">
      <Select
        value={selectedUserId}
        onValueChange={handleUserSelect} // Updated to use the new handler
      >
        <SelectTrigger>
          <SelectValue placeholder="Select a user" />
        </SelectTrigger>
        <SelectContent>
          {users.map(user => ( // Display all users in the select list
            <SelectItem key={user._id} value={user._id}>
              {user.userName}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className=''>
        <h4 className='mb-1'>Free Users:</h4> {/* Added header for free users */}
        {freeUsers.map(user => ( // Display free users below the select list
          <div key={user._id} className="flex items-center justify-between margin-10">
            <span className='rounded-md mobile-100 w-[90%] d-block'>{user.userName}</span>
            <Button
              onClick={() => removeUser(user._id)}
              variant="destructive"
              size="sm"
            >
              Remove
            </Button>
          </div>
        ))}
        {selectedUsers.map(user => (
          <div key={user._id} className="flex items-center justify-between margin-10">
            <span className='rounded-md mobile-100 w-[90%] d-block'>{user.userName}</span>
            <Button
              onClick={() => removeUser(user._id)}
              variant="destructive"
              size="sm"
            >
              Remove
            </Button>
          </div>
        ))}
      </div>
    </div>
  );
};

export function ModelDropdown({ onSelect }: ModelDropdownProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentModal, setCurrentModal] = useState<string | null>(null)
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
  const [users, setUsers] = useState<{ _id: string; userName: string }[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<{ _id: string; userName: string }[]>([]);

  useEffect(() => {
    const fetchPromptData = async () => {
      try {
        const response = await fetch('https://dashboard.flashailens.com/api/dashboard/getPromptValue');
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
        const response = await fetch('https://dashboard.flashailens.com/api/dashboard/getNegativeKeywords');
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
        const response = await fetch('https://dashboard.flashailens.com/api/dashboard/getFirebaseUser');
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

    const fetchUsers = async () => {
      try {
        const response = await fetch('https://dashboard.flashailens.com/api/dashboard/getUsers');
          const data: FirebaseUserAPIResponse = await response.json();
          setUsers(Array.isArray(data.data) ? data.data.map((user: { _id: string; userName: string }) => ({ _id: user._id, userName: user.userName })) : []);
        } catch (error) {
          console.error('Error fetching users:', error);
      };
    }
    fetchPromptData();
    fetchNegativeKeywords();
    fetchFirebaseUserData();
    fetchUsers();
  }, []);

  const handleOptionSelect = (option: string) => {
    setCurrentModal(option);
    setIsModalOpen(true);
    if (option === "Add Free Subscription User") {
      setSelectedUsers([]); // Reset selected users when opening the modal
    }
  }

  const options = [
    "Add Negative Keywords",
    "Add Free Subscription User",
    "System Prompt",
    "Remix Prompt",
    "Update Testing And User Value"
  ]

  // const handleOptionSelect = (option: string) => {
  //   setCurrentModal(option)
  //   setIsModalOpen(true)
  // }

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
        const response = await fetch(`https://dashboard.flashailens.com/api/dashboard/deleteNegativeKeywords/${keywordToRemove._id}`, {
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

          const response = await fetch('https://dashboard.flashailens.com/api/dashboard/addNegativeKeywords', {
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
          const response = await fetch('https://dashboard.flashailens.com/api/dashboard/updatePromptValue', {
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
          const response = await fetch('https://dashboard.flashailens.com/api/dashboard/updatePromptValue', {
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
          const response = await fetch('https://dashboard.flashailens.com/api/dashboard/updateFirebaseUserValue', {
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
        <DialogContent className="login-popup sm:max-w-[425px] md:max-w-[600px] lg:max-w-[800px] xl:max-w-[1000px] w-full">
          <DialogHeader>
            <DialogTitle>{currentModal}</DialogTitle>
          </DialogHeader>
          <div className="max-h-[63vh] overflow-y-auto p-4">
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

            {currentModal === "Add Free Subscription User" && (
              <AddFreeSubscriptionUserModal
                users={users}
                selectedUsers={selectedUsers}
                setSelectedUsers={setSelectedUsers}
              />
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className='mb-01' onClick={handleSave}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
