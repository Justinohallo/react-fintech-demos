import type { Metadata } from "next";
import { ChallengeBrief } from "@/components/brief/ChallengeBrief";

export const metadata: Metadata = { title: "08 · Approvals queue" };

export default function Page() {
  return <ChallengeBrief number="08" />;
}
