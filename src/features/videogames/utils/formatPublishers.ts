import { Company } from "../domain/company";

export function formatPublishers(companies: Company[]): string {
  if (companies.length === 0) {
    return "N/A";
  }

  return companies
    .map(c => c.name)
    .join(", ");
}
