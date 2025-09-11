"use client";

import { useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { createPersonne, updatePersonne } from "@/lib/actions";
import { RELIGIOUS_LEVEL_LABELS } from "@/lib/constants";

interface PersonFormProps {
  person?: {
    id: string;
    name: string;
    age: number;
    religious_level: number;
    center_of_interest: string[];
    phone?: string | null;
  };
  onClose: () => void;
}

export function PersonForm({ person, onClose }: PersonFormProps) {
  const [interests, setInterests] = useState<string[]>(
    person?.center_of_interest || [],
  );
  const [currentInterest, setCurrentInterest] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddInterest = () => {
    if (currentInterest.trim() && !interests.includes(currentInterest.trim())) {
      setInterests([...interests, currentInterest.trim()]);
      setCurrentInterest("");
    }
  };

  const handleRemoveInterest = (indexToRemove: number) => {
    setInterests(interests.filter((_, index) => index !== indexToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddInterest();
    }
  };

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    formData.set("interests", interests.join(","));

    try {
      if (person) {
        await updatePersonne(person.id, formData);
      } else {
        await createPersonne(formData);
      }
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
          <label htmlFor="name" className="block text-sm font-medium mb-2">
            Nom
          </label>
          <Input
            id="name"
            name="name"
            defaultValue={person?.name}
            required
            placeholder="Nom de la personne"
          />
        </div>

        <div>
          <label htmlFor="age" className="block text-sm font-medium mb-2">
            Âge
          </label>
          <Input
            id="age"
            name="age"
            type="number"
            min="18"
            max="120"
            defaultValue={person?.age}
            required
            placeholder="Âge"
          />
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium mb-2">
            Téléphone
          </label>
          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={person?.phone || ""}
            placeholder="+33123456789"
          />
        </div>

        <div>
          <label
            htmlFor="religious_level"
            className="block text-sm font-medium mb-2"
          >
            Niveau de religion
          </label>
          <Select
            name="religious_level"
            defaultValue={person?.religious_level.toString()}
          >
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un niveau" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(RELIGIOUS_LEVEL_LABELS).map(([value, label]) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <label htmlFor="interest" className="block text-sm font-medium mb-2">
            Centres d&apos;intérêt
          </label>
          <Input
            id="interest"
            value={currentInterest}
            onChange={(e) => setCurrentInterest(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ajouter un centre d'intérêt (Entrée pour ajouter)"
          />

          {interests.length > 0 && (
            <div className="mt-3 space-y-2">
              {interests.map((interest, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between bg-secondary px-3 py-2 rounded-md"
                >
                  <span className="text-sm">{interest}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveInterest(index)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex justify-between">
        <div>
          {person?.phone && (
            <WhatsAppButton
              phoneNumber={person.phone}
              personName={person.name}
              size="sm"
            />
          )}
        </div>
        <div className="flex space-x-2">
          <Button type="button" variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "..." : person ? "Modifier" : "Ajouter"}
          </Button>
        </div>
      </div>
    </form>
  );
}
