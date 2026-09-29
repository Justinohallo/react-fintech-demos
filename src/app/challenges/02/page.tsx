import type { Metadata } from "next";
import { ChallengeBrief } from "@/components/brief/ChallengeBrief";

export const metadata: Metadata = { title: "02 · Plan picker" };

export default function Page() {
  return <ChallengeBrief number="02" />;
}
