import React, { useState } from 'react'
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

export function ModelDropdown({ onSelect }: ModelDropdownProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentModal, setCurrentModal] = useState<string | null>(null)
  const [negativeKeywords, setNegativeKeywords] = useState<string[]>([])
  const [currentKeyword, setCurrentKeyword] = useState('')
  const [systemPrompt, setSystemPrompt] = useState('')
  const [remixPrompt, setRemixPrompt] = useState('')
  const [remixSystemPrompt, setRemixSystemPrompt] = useState('')
  const [testingValues, setTestingValues] = useState({
    freeMultiImage: '',
    freeUserLimit: '',
    freeTryLimit: '',
    proMultiImage: '',
    proUserLimit: '',
    proUserExtraCredit: '',
    civitaiAPIKey: '',
    productionUrl: '',
    stageUrl: '',
    live: 'True'
  })

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
    if (currentKeyword && !negativeKeywords.includes(currentKeyword)) {
      setNegativeKeywords([...negativeKeywords, currentKeyword])
      setCurrentKeyword('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setNegativeKeywords(negativeKeywords.filter(k => k !== keyword))
  }

  const handleSave = () => {
    switch (currentModal) {
      case "Add Negative Keywords":
        console.log("Saved negative keywords:", negativeKeywords)
        break
      case "System Prompt":
        console.log("Saved system prompt:", systemPrompt)
        break
      case "Remix Prompt":
        console.log("Saved remix prompt:", remixPrompt)
        console.log("Saved remix system prompt:", remixSystemPrompt)
        break
      case "Update Testing And User Value":
        console.log("Saved testing values:", testingValues)
        break
    }
    onSelect(currentModal || "")
    setIsModalOpen(false)
  }

  const handleTestingValueChange = (key: string, value: string) => {
    setTestingValues(prev => ({ ...prev, [key]: value }))
  }

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
        <DialogContent className="border-0ra w-[60rem] width-60rem mobile-de">
          <DialogHeader>
            <DialogTitle>{currentModal}</DialogTitle>
          </DialogHeader>
          {currentModal === "Add Negative Keywords" && (
            <div className="grid gap-4 py-4">
              {negativeKeywords.map((keyword, index) => (
                <div key={index} className="flex items-center justify-between">
                  <Input value={keyword} readOnly />
                  <Button onClick={() => removeKeyword(keyword)} variant="destructive" size="sm">
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
          )}
          {currentModal === "System Prompt" && (
            <div className="grid gap-4 py-4">
              <Textarea
                value={systemPrompt}
                onChange={(e) => setSystemPrompt(e.target.value)}
                placeholder="Enter system prompt"
              />
            </div>
          )}
          {currentModal === "Remix Prompt" && (
            <div className="grid gap-4 py-4">
              <Textarea
                value={remixPrompt}
                onChange={(e) => setRemixPrompt(e.target.value)}
                placeholder="Enter remix prompt"
              />
              <Textarea
                value={remixSystemPrompt}
                onChange={(e) => setRemixSystemPrompt(e.target.value)}
                placeholder="Enter remix system prompt"
              />
            </div>
          )}
          {currentModal === "Update Testing And User Value" && (
            <div className="grid gap-4 py-4">
              {Object.entries(testingValues).map(([key, value]) => (
                <div key={key} className="grid grid-cols-2 items-center gap-4">
                  <Label htmlFor={key}>{key}</Label>
                  {key === 'live' ? (
                    <Select value={value} onValueChange={(val) => handleTestingValueChange(key, val)}>
                      <SelectTrigger id={key}>
                        <SelectValue placeholder="Select..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="True">True</SelectItem>
                        <SelectItem value="False">False</SelectItem>
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
          )}
          <DialogFooter>
            <Button  variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button className='mb-01' onClick={handleSave}>Update</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}