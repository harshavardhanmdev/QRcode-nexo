import type { Metadata } from "next";
import { AccountDashboard } from "@/components/account/AccountDashboard";

export const metadata: Metadata = {
  title: "Your codes & designs",
  robots: { index: false },
};

export default function AccountPage() {
  return <AccountDashboard />;
}
