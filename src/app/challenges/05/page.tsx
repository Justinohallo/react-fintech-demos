import type { Metadata } from "next";
import { ChallengeBrief } from "@/components/brief/ChallengeBrief";

export const metadata: Metadata = { title: "05 · Bitcoin treasury" };

export default function Page() {
  return <ChallengeBrief number="05" />;
}
