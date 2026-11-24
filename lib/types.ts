
// These must be kept in sync with the types in the database.
export type Role = "user" | "admin";
export type Status = "complete" | "incomplete";

export type Optional<a> = a | null;

// This data comes over the wire as json. As such,
// we don't have access to the fancy types like Date.
export type ConsultationData = {
  id: string,
  first_name: Optional<string>,
  last_name: Optional<string>,
  reason: string,
  scheduled: string,
  status: Optional<Status>,
};
