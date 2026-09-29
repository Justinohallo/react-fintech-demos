import type { Metadata } from "next";
import { DeliverableFrame } from "@/components/attempts/DeliverableFrame";

export const metadata: Metadata = { title: "04 · Send a payment · Attempts" };

export default function DeliverableLayout({ children }: LayoutProps<"/challenges/04/deliverable">) {
  return <DeliverableFrame challenge="04">{children}</DeliverableFrame>;
}
