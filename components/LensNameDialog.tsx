import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'

interface LensNameDialogProps {
  lensName: string;
  onSave: (newName: string) => Promise<void>;
}

export const LensNameDialog: React.FC<LensNameDialogProps> = ({ lensName, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempName, setTempName] = useState(lensName);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => {
    setTempName(lensName);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = async () => {
    try {
      await onSave(tempName);
      handleClose();
    } catch (error) {
      console.error('Error updating lens name:', error);
    } 
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer ml-2" onClick={handleOpen}>{lensName}</span>
      </DialogTrigger>
      <DialogContent className='login-popup'>
        <DialogHeader>
          <DialogTitle>Edit Lens Name</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            placeholder="Enter new lens name"
          />
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>Cancel</Button>
          <Button className='mb-01' onClick={handleSave} disabled={isLoading}>
            {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};