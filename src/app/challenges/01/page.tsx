import type { Metadata } from "next";
import { ChallengeBrief } from "@/components/brief/ChallengeBrief";

export const metadata: Metadata = { title: "01 · Treasury balance" };

export default function Page() {
  return <ChallengeBrief number="01" />;
}
