import type { Metadata } from "next";
import { ChallengeBrief } from "@/components/brief/ChallengeBrief";

export const metadata: Metadata = { title: "09 · Spend analytics" };

export default function Page() {
  return <ChallengeBrief number="09" />;
}
