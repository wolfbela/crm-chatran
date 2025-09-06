"use client";

import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface Meeting {
  id: number;
  personne_1_name?: string | null;
  personne_2_name?: string | null;
  date: string | Date;
}

interface CalendarProps {
  meetings: Meeting[];
  className?: string;
}

const DAYS = ["Dim", "Lun", "Mar", "Mer", "Jeu", "Ven", "Sam"];
const MONTHS = [
  "Janvier",
  "Février",
  "Mars",
  "Avril",
  "Mai",
  "Juin",
  "Juillet",
  "Août",
  "Septembre",
  "Octobre",
  "Novembre",
  "Décembre",
];

export function Calendar({ meetings, className }: CalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );
  const lastDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );
  const startDate = new Date(firstDayOfMonth);
  startDate.setDate(startDate.getDate() - firstDayOfMonth.getDay());

  const days: Date[] = [];
  const current = new Date(startDate);

  while (current <= lastDayOfMonth || days.length % 7 !== 0) {
    days.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  const getMeetingsForDate = (date: Date) => {
    return meetings.filter((meeting) => {
      const meetingDate = new Date(meeting.date);
      return meetingDate.toDateString() === date.toDateString();
    });
  };

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  return (
    <div className={cn("bg-background border rounded-lg p-4", className)}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">
          {MONTHS[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h3>
        <div className="flex space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("prev")}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigateMonth("next")}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {DAYS.map((day) => (
          <div
            key={day}
            className="text-center text-sm font-medium text-muted-foreground p-2"
          >
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => {
          const dayMeetings = getMeetingsForDate(day);
          const isCurrentMonth = day.getMonth() === currentDate.getMonth();
          const isToday = day.toDateString() === new Date().toDateString();

          return (
            <div
              key={index}
              className={cn(
                "min-h-[60px] p-1 border rounded",
                isCurrentMonth ? "bg-background" : "bg-muted/20",
                isToday && "bg-primary/10 border-primary",
              )}
            >
              <div
                className={cn(
                  "text-sm font-medium mb-1",
                  isCurrentMonth ? "text-foreground" : "text-muted-foreground",
                  isToday && "text-primary",
                )}
              >
                {day.getDate()}
              </div>

              {dayMeetings.length > 0 && (
                <div className="space-y-1">
                  {dayMeetings.slice(0, 2).map((meeting) => (
                    <div
                      key={meeting.id}
                      className="text-xs bg-primary/20 text-primary px-1 py-0.5 rounded truncate"
                      title={`${meeting.personne_1_name} - ${meeting.personne_2_name}`}
                    >
                      {meeting.personne_1_name && meeting.personne_2_name
                        ? `${meeting.personne_1_name.split(" ")[0]} - ${meeting.personne_2_name.split(" ")[0]}`
                        : "Meeting"}
                    </div>
                  ))}
                  {dayMeetings.length > 2 && (
                    <div className="text-xs text-muted-foreground">
                      +{dayMeetings.length - 2} autres
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
