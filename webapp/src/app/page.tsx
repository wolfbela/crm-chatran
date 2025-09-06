import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonCard } from "@/components/person-card";
import { MeetingCard } from "@/components/meeting-card";
import { PersonDialog } from "@/components/person-dialog";
import { MeetingDialog } from "@/components/meeting-dialog";
import { Calendar } from "@/components/calendar";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getPersonnes, getMeetings } from "@/lib/actions";
import { MESSAGES } from "@/lib/constants";

export default async function Dashboard() {
  const personnes = await getPersonnes();
  const meetings = await getMeetings();

  return (
    <div className="container mx-auto px-4 py-6 space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Tableau de bord</h1>
        <div className="flex space-x-2">
          <PersonDialog
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter une personne
              </Button>
            }
            title="Ajouter une personne"
          />
          <MeetingDialog
            personnes={personnes.map((p) => ({ id: p.id, name: p.name }))}
            trigger={
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un meeting
              </Button>
            }
            title="Ajouter un meeting"
          />
        </div>
      </div>

      {/* Carrousel des meetings */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold">Meetings à venir</h2>
        {meetings.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            {MESSAGES.EMPTY_STATE.NO_MEETINGS}
          </div>
        ) : (
          <Carousel className="w-full">
            <CarouselContent>
              {meetings.map((meeting) => (
                <CarouselItem
                  key={meeting.id}
                  className="md:basis-1/2 lg:basis-1/3"
                >
                  <MeetingDialog
                    personnes={personnes.map((p) => ({
                      id: p.id,
                      name: p.name,
                    }))}
                    meeting={{
                      id: meeting.id,
                      personne_1: meeting.personne_1,
                      personne_2: meeting.personne_2,
                      date: meeting.date,
                    }}
                    trigger={
                      <div className="cursor-pointer p-1">
                        <MeetingCard meeting={meeting} />
                      </div>
                    }
                    title="Modifier le meeting"
                  />
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
        )}
      </div>

      {/* Section inférieure avec personnes et calendrier */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Liste des personnes */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Personnes</h2>
          <div className="space-y-4 max-h-[500px] overflow-y-auto">
            {personnes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                {MESSAGES.EMPTY_STATE.NO_PERSONS}
              </div>
            ) : (
              personnes.slice(0, 6).map((person) => (
                <PersonDialog
                  key={person.id}
                  person={person}
                  trigger={
                    <div className="cursor-pointer">
                      <PersonCard person={person} />
                    </div>
                  }
                  title="Modifier la personne"
                />
              ))
            )}
          </div>
        </div>

        {/* Calendrier */}
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Calendrier</h2>
          <Calendar meetings={meetings} className="max-h-[500px]" />
        </div>
      </div>
    </div>
  );
}
