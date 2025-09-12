export interface PersonneData {
  id: string;
  name: string;
  age: number;
  religious_level: number;
  center_of_interest: string[];
  phone: string | null;
  created_at: Date;
  updated_at: Date;
}

export interface MeetingData {
  id: number;
  personne_1: string;
  personne_2: string;
  date: Date;
  created_at: Date;
  personne_1_name?: string | null;
  personne_2_name?: string | null;
}

export interface ActionResult {
  success: boolean;
}
