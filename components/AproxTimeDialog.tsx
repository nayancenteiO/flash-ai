import React, { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2 } from 'lucide-react'

interface AproxTimeDialogProps {
  aproxTime: string;
  onSave: (newValue: string) => Promise<void>;
}

export const AproxTimeDialog: React.FC<AproxTimeDialogProps> = ({ aproxTime, onSave }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [tempValue, setTempValue] = useState(aproxTime);
  const [isLoading, setIsLoading] = useState(false);

  const handleOpen = () => {
    setTempValue(aproxTime);
    setIsOpen(true);
  };

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      await onSave(tempValue);
      handleClose();
    } catch (error) {
      console.error('Error updating Aprox Time:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <span className="cursor-pointer mobile-1000 d-block rounded-md" onClick={handleOpen}>{aproxTime}</span>
      </DialogTrigger>
      <DialogContent className='login-popup'>
        <DialogHeader>
          <DialogTitle>Edit Aprox Time</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            value={tempValue}
            onChange={(e) => setTempValue(e.target.value)}
            placeholder="Enter Aprox Time"
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