import type { Metadata } from "next";
import { DeliverableFrame } from "@/components/attempts/DeliverableFrame";

export const metadata: Metadata = { title: "10 · Transactions · Attempts" };

export default function DeliverableLayout({ children }: LayoutProps<"/challenges/10/deliverable">) {
  return <DeliverableFrame challenge="10">{children}</DeliverableFrame>;
}
