import type { Metadata } from "next";
import { ChallengeBrief } from "@/components/brief/ChallengeBrief";

export const metadata: Metadata = { title: "06 · Budgets" };

export default function Page() {
  return <ChallengeBrief number="06" />;
}
