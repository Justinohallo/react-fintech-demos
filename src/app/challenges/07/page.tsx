import type { Metadata } from "next";
import { ChallengeBrief } from "@/components/brief/ChallengeBrief";

export const metadata: Metadata = { title: "07 · Expense report" };

export default function Page() {
  return <ChallengeBrief number="07" />;
}
