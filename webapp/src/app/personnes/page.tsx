import { Plus, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PersonDialog } from "@/components/person-dialog";
import { DeletePersonButton } from "@/components/delete-person-button";
import { getPersonnes } from "@/lib/actions";
import { RELIGIOUS_LEVEL_LABELS, MESSAGES } from "@/lib/constants";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export default async function PersonnesPage() {
  const personnes = await getPersonnes();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Personnes</h1>
        <PersonDialog
          trigger={
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Ajouter une personne
            </Button>
          }
          title="Ajouter une personne"
        />
      </div>

      {personnes.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          {MESSAGES.EMPTY_STATE.NO_PERSONS}
        </div>
      ) : (
        <div className="border rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Âge</TableHead>
                <TableHead>Niveau religieux</TableHead>
                <TableHead>Centres d&apos;intérêt</TableHead>
                <TableHead className="w-[100px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {personnes.map((person) => (
                <TableRow key={person.id}>
                  <TableCell className="font-medium">{person.name}</TableCell>
                  <TableCell>{person.age} ans</TableCell>
                  <TableCell>
                    {
                      RELIGIOUS_LEVEL_LABELS[
                        person.religious_level as keyof typeof RELIGIOUS_LEVEL_LABELS
                      ]
                    }
                  </TableCell>
                  <TableCell>
                    {person.center_of_interest?.join(", ") || "Aucun"}
                  </TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <PersonDialog
                        person={person}
                        trigger={
                          <Button variant="ghost" size="sm">
                            <Edit className="h-4 w-4" />
                          </Button>
                        }
                        title="Modifier la personne"
                      />
                      <DeletePersonButton
                        personId={person.id}
                        personName={person.name}
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
