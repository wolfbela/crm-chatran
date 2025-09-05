"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PersonForm } from "@/components/person-form";

interface PersonDialogProps {
  person?: {
    id: string;
    name: string;
    age: number;
    religious_level: number;
    center_of_interest: string[];
  };
  trigger: React.ReactNode;
  title: string;
}

export function PersonDialog({ person, trigger, title }: PersonDialogProps) {
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
        <PersonForm person={person} onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
