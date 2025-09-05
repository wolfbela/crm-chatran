"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { createMeeting } from "@/lib/actions";

interface MeetingFormProps {
  personnes: Array<{
    id: string;
    name: string;
  }>;
  onClose: () => void;
}

export function MeetingForm({ personnes, onClose }: MeetingFormProps) {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    if (!selectedDate) {
      return;
    }

    setIsSubmitting(true);
    formData.set("date", selectedDate.toISOString());

    try {
      await createMeeting(formData);
      onClose();
    } catch {
      // Error will be handled by the UI
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div>
          <label
            htmlFor="personne_1"
            className="block text-sm font-medium mb-2"
          >
            Première personne
          </label>
          <Select name="personne_1" required>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une personne" />
            </SelectTrigger>
            <SelectContent>
              {personnes.map((personne) => (
                <SelectItem key={personne.id} value={personne.id}>
                  {personne.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label
            htmlFor="personne_2"
            className="block text-sm font-medium mb-2"
          >
            Deuxième personne
          </label>
          <Select name="personne_2" required>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une personne" />
            </SelectTrigger>
            <SelectContent>
              {personnes.map((personne) => (
                <SelectItem key={personne.id} value={personne.id}>
                  {personne.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Date du meeting
          </label>
          <DatePicker
            date={selectedDate}
            onSelect={setSelectedDate}
            placeholder="Sélectionner une date"
          />
        </div>
      </div>

      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onClose}>
          Annuler
        </Button>
        <Button type="submit" disabled={isSubmitting || !selectedDate}>
          {isSubmitting ? "..." : "Ajouter"}
        </Button>
      </div>
    </form>
  );
}
