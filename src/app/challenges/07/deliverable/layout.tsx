import type { Metadata } from "next";
import { DeliverableFrame } from "@/components/attempts/DeliverableFrame";

export const metadata: Metadata = { title: "07 · Expense report · Attempts" };

export default function DeliverableLayout({ children }: LayoutProps<"/challenges/07/deliverable">) {
  return <DeliverableFrame challenge="07">{children}</DeliverableFrame>;
}
