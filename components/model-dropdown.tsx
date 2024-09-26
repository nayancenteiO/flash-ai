import React, { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

interface ModelDropdownProps {
  onSelect: (option: string) => void
}

export function ModelDropdown({ onSelect }: ModelDropdownProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [keywords, setKeywords] = useState<string[]>([])
  const [currentKeyword, setCurrentKeyword] = useState('')

  const options = [
    "Update Upscale Value"
  ]

  const handleOptionSelect = (option: string) => {
    if (option === "Update Upscale Value") {
      setIsModalOpen(true)
    } else {
      onSelect(option)
    }
  }

  const addKeyword = () => {
    if (currentKeyword && !keywords.includes(currentKeyword)) {
      setKeywords([...keywords, currentKeyword])
      setCurrentKeyword('')
    }
  }

  const removeKeyword = (keyword: string) => {
    setKeywords(keywords.filter(k => k !== keyword))
  }

  const handleSaveKeywords = () => {
    console.log("Saved keywords:", keywords)
    onSelect("Update Upscale Value")
    setIsModalOpen(false)
    setKeywords([])
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
        <DialogContent className=" w-[90%]">
          <DialogHeader>
            <DialogTitle>Update Upscale Value</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {keywords.map((keyword, index) => (
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
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button onClick={handleSaveKeywords}>Save</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}