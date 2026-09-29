import type { Metadata } from "next";
import { DeliverableFrame } from "@/components/attempts/DeliverableFrame";

export const metadata: Metadata = { title: "03 · Card controls · Attempts" };

export default function DeliverableLayout({ children }: LayoutProps<"/challenges/03/deliverable">) {
  return <DeliverableFrame challenge="03">{children}</DeliverableFrame>;
}
