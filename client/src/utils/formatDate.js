import { format, parse } from "date-fns";

export function formatDate(date) {
  const parsed = parse(date, "yyyy-MM-dd'T'HH:mm:ss.SSSX", new Date());
  return format(parsed, "MMM dd YYY HH:mm");
}
