import { PasswordEntry } from "@/components/account/password-entry";

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return <PasswordEntry destination={(await searchParams).next} />;
}
