// Barrel file for actions - explicit exports for better module resolution
export {
  createPersonne,
  updatePersonne,
  deletePersonne,
  getPersonnes,
} from "./actions/personnes";

export {
  createMeeting,
  updateMeeting,
  deleteMeeting,
  getMeetings,
  type MeetingWithNames,
} from "./actions/meetings";

export { type PersonneData, type ActionResult } from "./actions/types";
