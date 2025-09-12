"use server";

import { revalidatePath } from "next/cache";
import { Insertable } from "kysely";
import { db, Database } from "@/lib/database";
import { MESSAGES } from "@/lib/constants";
import { PersonneData, ActionResult } from "./types";

export async function createPersonne(
  formData: FormData,
): Promise<ActionResult> {
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

export async function updatePersonne(
  id: string,
  formData: FormData,
): Promise<ActionResult> {
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

export async function deletePersonne(id: string): Promise<ActionResult> {
  try {
    await db.deleteFrom("personnes").where("id", "=", id).execute();
    revalidatePath("/");
    revalidatePath("/personnes");
    return { success: true };
  } catch {
    throw new Error(MESSAGES.ERROR.PERSON_DELETE_ERROR);
  }
}

export async function getPersonnes(): Promise<PersonneData[]> {
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
