"use client";

import { format } from "date-fns";

interface MeetingCardProps {
  meeting: {
    id: number;
    date: Date;
    personne_1_name: string | null;
    personne_2_name: string | null;
  };
}

export function MeetingCard({ meeting }: MeetingCardProps) {
  return (
    <div
      onClick={() => {}}
      className="cursor-pointer bg-card border border-border rounded-lg p-4 hover:shadow-md transition-shadow"
    >
      <div className="space-y-3">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Première personne:
            </span>
            <span className="font-semibold">
              {meeting.personne_1_name || "Inconnue"}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Deuxième personne:
            </span>
            <span className="font-semibold">
              {meeting.personne_2_name || "Inconnue"}
            </span>
          </div>
        </div>

        <div className="pt-2 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">
              Date:
            </span>
            <span className="text-sm font-medium text-primary">
              {format(new Date(meeting.date), "dd/MM/yyyy")}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
