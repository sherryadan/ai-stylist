import { PasswordEntry } from "@/components/account/password-entry";

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ next?: string }> }) {
  return <PasswordEntry registration destination={(await searchParams).next} />;
}
