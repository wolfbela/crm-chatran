"use server";

import { revalidatePath } from "next/cache";
import { Insertable } from "kysely";
import { db, Database } from "@/lib/database";
import { MESSAGES } from "@/lib/constants";

export async function createPersonne(formData: FormData) {
  const name = formData.get("name") as string;
  const age = parseInt(formData.get("age") as string);
  const religious_level = parseInt(formData.get("religious_level") as string);
  const phone = formData.get("phone") as string;
  const interests = formData.get("interests") as string;

  if (!name || !age || !religious_level) {
    throw new Error(MESSAGES.ERROR.REQUIRED_FIELDS);
  }

  const center_of_interest = interests
    ? interests.split(",").map((s) => s.trim())
    : [];

  try {
    const personData: Insertable<Database["personnes"]> = {
      name,
      age,
      religious_level,
      phone: phone || null,
      center_of_interest,
    };

    await db.insertInto("personnes").values(personData).execute();

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error creating personne:", error);
    throw new Error(MESSAGES.ERROR.PERSON_CREATE_ERROR);
  }
}

export async function updatePersonne(id: string, formData: FormData) {
  const name = formData.get("name") as string;
  const age = parseInt(formData.get("age") as string);
  const religious_level = parseInt(formData.get("religious_level") as string);
  const phone = formData.get("phone") as string;
  const interests = formData.get("interests") as string;
  const center_of_interest = interests
    ? interests.split(",").map((s) => s.trim())
    : [];

  if (!name || !age || !religious_level) {
    throw new Error(MESSAGES.ERROR.REQUIRED_FIELDS);
  }

  try {
    await db
      .updateTable("personnes")
      .set({
        name,
        age,
        religious_level,
        phone: phone || null,
        center_of_interest,
        updated_at: new Date(),
      })
      .where("id", "=", id)
      .execute();

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error updating personne:", error);
    throw new Error(MESSAGES.ERROR.PERSON_UPDATE_ERROR);
  }
}

export async function deletePersonne(id: string) {
  try {
    await db.deleteFrom("personnes").where("id", "=", id).execute();
    revalidatePath("/");
    revalidatePath("/personnes");
    return { success: true };
  } catch {
    throw new Error(MESSAGES.ERROR.PERSON_DELETE_ERROR);
  }
}

export async function createMeeting(formData: FormData) {
  const personne_1 = formData.get("personne_1") as string;
  const personne_2 = formData.get("personne_2") as string;
  const date = formData.get("date") as string;

  if (!personne_1 || !personne_2 || !date) {
    throw new Error(MESSAGES.ERROR.REQUIRED_FIELDS);
  }

  if (personne_1 === personne_2) {
    throw new Error(MESSAGES.ERROR.DIFFERENT_PERSONS);
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
    throw new Error(MESSAGES.ERROR.MEETING_CREATE_ERROR);
  }
}

export async function updateMeeting(id: number, formData: FormData) {
  const personne_1 = formData.get("personne_1") as string;
  const personne_2 = formData.get("personne_2") as string;
  const date = formData.get("date") as string;

  if (!personne_1 || !personne_2 || !date) {
    throw new Error(MESSAGES.ERROR.REQUIRED_FIELDS);
  }

  if (personne_1 === personne_2) {
    throw new Error(MESSAGES.ERROR.DIFFERENT_PERSONS);
  }

  try {
    await db
      .updateTable("meetings")
      .set({
        personne_1,
        personne_2,
        date: new Date(date),
      })
      .where("id", "=", id)
      .execute();

    revalidatePath("/");
    return { success: true };
  } catch {
    throw new Error(MESSAGES.ERROR.MEETING_UPDATE_ERROR);
  }
}

export async function deleteMeeting(id: number) {
  try {
    await db.deleteFrom("meetings").where("id", "=", id).execute();
    revalidatePath("/");
    revalidatePath("/meetings");
    return { success: true };
  } catch {
    throw new Error(MESSAGES.ERROR.MEETING_DELETE_ERROR);
  }
}

export async function getPersonnes() {
  try {
    return await db
      .selectFrom("personnes")
      .selectAll()
      .orderBy("created_at", "desc")
      .execute();
  } catch (error) {
    console.error("Error fetching personnes:", error);
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
        "meetings.personne_1",
        "meetings.personne_2",
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
