import type { Metadata } from "next";
import { DeliverableFrame } from "@/components/attempts/DeliverableFrame";

export const metadata: Metadata = { title: "09 · Spend analytics · Attempts" };

export default function DeliverableLayout({ children }: LayoutProps<"/challenges/09/deliverable">) {
  return <DeliverableFrame challenge="09">{children}</DeliverableFrame>;
}
