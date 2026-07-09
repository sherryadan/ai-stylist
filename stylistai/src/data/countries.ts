export interface Country {
  code: string;
  name: string;
  cities: string[];
}

export const countries: Country[] = [
  { code: "US", name: "United States", cities: ["New York", "Los Angeles", "Chicago", "Houston", "Miami"] },
  { code: "GB", name: "United Kingdom", cities: ["London", "Manchester", "Birmingham", "Edinburgh", "Bristol"] },
  { code: "PK", name: "Pakistan", cities: ["Lahore", "Karachi", "Islamabad", "Faisalabad", "Rawalpindi"] },
  { code: "AE", name: "United Arab Emirates", cities: ["Dubai", "Abu Dhabi", "Sharjah", "Ajman"] },
  { code: "SA", name: "Saudi Arabia", cities: ["Riyadh", "Jeddah", "Dammam", "Mecca"] },
  { code: "CA", name: "Canada", cities: ["Toronto", "Vancouver", "Montreal", "Calgary", "Ottawa"] },
  { code: "AU", name: "Australia", cities: ["Sydney", "Melbourne", "Brisbane", "Perth", "Adelaide"] },
  { code: "DE", name: "Germany", cities: ["Berlin", "Munich", "Hamburg", "Frankfurt", "Cologne"] },
  { code: "FR", name: "France", cities: ["Paris", "Lyon", "Marseille", "Toulouse", "Nice"] },
  { code: "JP", name: "Japan", cities: ["Tokyo", "Osaka", "Kyoto", "Yokohama", "Nagoya"] },
];

export const getCitiesByCountry = (countryCode: string): string[] =>
  countries.find((c) => c.code === countryCode)?.cities ?? [];
