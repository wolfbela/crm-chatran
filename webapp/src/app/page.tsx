import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonCard } from "@/components/person-card";
import { MeetingCard } from "@/components/meeting-card";
import { PersonDialog } from "@/components/person-dialog";
import { MeetingDialog } from "@/components/meeting-dialog";
import { getPersonnes, getMeetings } from "@/lib/actions";

export default async function Dashboard() {
  const personnes = await getPersonnes();
  const meetings = await getMeetings();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Tableau de bord</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Section Personnes */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Personnes</h2>
            <PersonDialog
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              }
              title="Ajouter une personne"
            />
          </div>

          <div className="grid gap-4">
            {personnes.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune personne trouvée
              </div>
            ) : (
              personnes.map((person) => (
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

        {/* Section Meetings */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-semibold">Meetings</h2>
            <MeetingDialog
              personnes={personnes.map((p) => ({ id: p.id, name: p.name }))}
              trigger={
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Ajouter
                </Button>
              }
              title="Ajouter un meeting"
            />
          </div>

          <div className="grid gap-4">
            {meetings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun meeting trouvé
              </div>
            ) : (
              meetings.map((meeting) => (
                <div key={meeting.id}>
                  <MeetingCard meeting={meeting} />
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
