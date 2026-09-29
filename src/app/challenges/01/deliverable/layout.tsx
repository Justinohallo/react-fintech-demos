import type { Metadata } from "next";
import { DeliverableFrame } from "@/components/attempts/DeliverableFrame";

export const metadata: Metadata = { title: "01 · Treasury balance · Attempts" };

export default function DeliverableLayout({ children }: LayoutProps<"/challenges/01/deliverable">) {
  return <DeliverableFrame challenge="01">{children}</DeliverableFrame>;
}
