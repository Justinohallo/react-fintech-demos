import type { Metadata } from "next";
import { ChallengeBrief } from "@/components/brief/ChallengeBrief";

export const metadata: Metadata = { title: "03 · Card controls" };

export default function Page() {
  return <ChallengeBrief number="03" />;
}
