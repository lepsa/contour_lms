
export type Optional<a> = a | null;

// This data comes over the wire as json. As such,
// we don't have access to the fancy types like Date.
export type ConsultationCardParams = {
  id: string,
  first_name: Optional<string>,
  last_name: Optional<string>,
  reason: string,
  scheduled: string
};
