"use client";

import { Tag } from "@/components/ui/tag";
import { RELIGIOUS_LEVEL_LABELS } from "@/lib/constants";

interface PersonCardProps {
  person: {
    id: string;
    name: string;
    age: number;
    religious_level: number;
    center_of_interest: string[];
  };
}

export function PersonCard({ person }: PersonCardProps) {
  const displayedInterests = person.center_of_interest.slice(0, 2);

  return (
    <div
      onClick={() => {}}
      className="cursor-pointer bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="space-y-3">
        <div>
          <h3 className="font-semibold text-lg">{person.name}</h3>
          <p className="text-sm text-muted-foreground">{person.age} ans</p>
        </div>

        <div>
          <p className="text-sm font-medium text-foreground">
            {
              RELIGIOUS_LEVEL_LABELS[
                person.religious_level as keyof typeof RELIGIOUS_LEVEL_LABELS
              ]
            }
          </p>
        </div>

        {displayedInterests.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {displayedInterests.map((interest, index) => (
              <Tag key={index}>{interest}</Tag>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
