"use client";

import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { MeetingForm } from "@/components/meeting-form";

interface MeetingDialogProps {
  personnes: Array<{
    id: string;
    name: string;
  }>;
  trigger: React.ReactNode;
  title: string;
}

export function MeetingDialog({
  personnes,
  trigger,
  title,
}: MeetingDialogProps) {
  const [open, setOpen] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <MeetingForm personnes={personnes} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
