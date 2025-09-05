"use server";

import { revalidatePath } from "next/cache";
import { Insertable } from "kysely";
import { db, Database } from "@/lib/database";

export async function createPersonne(formData: FormData) {
  const name = formData.get("name") as string;
  const age = parseInt(formData.get("age") as string);
  const religious_level = parseInt(formData.get("religious_level") as string);
  const interests = formData.get("interests") as string;

  if (!name || !age || !religious_level) {
    throw new Error("Tous les champs requis doivent être remplis");
  }

  const center_of_interest = interests
    ? interests.split(",").filter(Boolean)
    : [];

  try {
    await db
      .insertInto("personnes")
      .values({
        name,
        age,
        religious_level,
        center_of_interest,
      })
      .execute();

    revalidatePath("/");
    return { success: true };
  } catch {
    throw new Error("Erreur lors de la création de la personne");
  }
}

export async function updatePersonne(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const age = parseInt(formData.get("age") as string);
  const religious_level = parseInt(formData.get("religious_level") as string);
  const interests = formData.get("interests") as string;

  if (!name || !age || !religious_level) {
    throw new Error("Tous les champs requis doivent être remplis");
  }

  const center_of_interest = interests
    ? interests.split(",").filter(Boolean)
    : [];

  try {
    await db
      .updateTable("personnes")
      .set({
        name,
        age,
        religious_level,
        center_of_interest,
      })
      .where("id", "=", id)
      .execute();

    revalidatePath("/");
    return { success: true };
  } catch {
    throw new Error("Erreur lors de la mise à jour de la personne");
  }
}

export async function createMeeting(formData: FormData) {
  const personne_1 = formData.get("personne_1") as string;
  const personne_2 = formData.get("personne_2") as string;
  const date = formData.get("date") as string;

  if (!personne_1 || !personne_2 || !date) {
    throw new Error("Tous les champs requis doivent être remplis");
  }

  if (personne_1 === personne_2) {
    throw new Error("Les deux personnes doivent être différentes");
  }

  try {
    const meetingData: Insertable<Database["meetings"]> = {
      personne_1,
      personne_2,
      date: new Date(date),
    };

    await db.insertInto("meetings").values(meetingData).execute();

    revalidatePath("/");
    return { success: true };
  } catch {
    throw new Error("Erreur lors de la création du meeting");
  }
}

export async function getPersonnes() {
  try {
    return await db
      .selectFrom("personnes")
      .selectAll()
      .orderBy("created_at", "desc")
      .execute();
  } catch {
    return [];
  }
}

export async function getMeetings() {
  try {
    const meetings = await db
      .selectFrom("meetings")
      .leftJoin("personnes as p1", "meetings.personne_1", "p1.id")
      .leftJoin("personnes as p2", "meetings.personne_2", "p2.id")
      .select([
        "meetings.id",
        "meetings.date",
        "meetings.created_at",
        "p1.name as personne_1_name",
        "p2.name as personne_2_name",
      ])
      .orderBy("meetings.date", "desc")
      .execute();

    return meetings;
  } catch {
    return [];
  }
}
