import { Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { MeetingDialog } from "@/components/meeting-dialog";
import { DeleteMeetingButton } from "@/components/delete-meeting-button";
import { getPersonnes, getMeetings } from "@/lib/actions";
import { MESSAGES } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function MeetingsPage() {
  const personnes = await getPersonnes();
  const meetings = await getMeetings();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Meetings</h1>
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

      {meetings.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {MESSAGES.EMPTY_STATE.NO_MEETINGS}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Personne 1</TableHead>
                <TableHead>Personne 2</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {meetings.map((meeting) => (
                <TableRow key={meeting.id}>
                  <TableCell className="font-medium">
                    {meeting.personne_1_name || meeting.personne_1}
                  </TableCell>
                  <TableCell className="font-medium">
                    {meeting.personne_2_name || meeting.personne_2}
                  </TableCell>
                  <TableCell>
                    {new Date(meeting.date).toLocaleDateString("fr-FR", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
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
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                        title="Modifier le meeting"
                      />
                      <DeleteMeetingButton
                        meetingId={meeting.id}
                        person1Name={meeting.personne_1_name}
                        person2Name={meeting.personne_2_name}
                      />
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
