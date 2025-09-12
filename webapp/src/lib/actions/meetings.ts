"use server";

import { revalidatePath } from "next/cache";
import { Insertable } from "kysely";
import { db, Database } from "@/lib/database";
import { MESSAGES } from "@/lib/constants";
import { ActionResult } from "./types";

export interface MeetingWithNames {
  id: number;
  personne_1: string;
  personne_2: string;
  date: Date;
  created_at: Date;
  personne_1_name: string | null;
  personne_2_name: string | null;
}

export async function createMeeting(formData: FormData): Promise<ActionResult> {
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

export async function updateMeeting(
  id: number,
  formData: FormData,
): Promise<ActionResult> {
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

export async function deleteMeeting(id: number): Promise<ActionResult> {
  try {
    await db.deleteFrom("meetings").where("id", "=", id).execute();
    revalidatePath("/");
    revalidatePath("/meetings");
    return { success: true };
  } catch {
    throw new Error(MESSAGES.ERROR.MEETING_DELETE_ERROR);
  }
}

export async function getMeetings(): Promise<MeetingWithNames[]> {
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
