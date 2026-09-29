import type { Metadata } from "next";
import { DeliverableFrame } from "@/components/attempts/DeliverableFrame";

export const metadata: Metadata = { title: "06 · Budgets · Attempts" };

export default function DeliverableLayout({ children }: LayoutProps<"/challenges/06/deliverable">) {
  return <DeliverableFrame challenge="06">{children}</DeliverableFrame>;
}
