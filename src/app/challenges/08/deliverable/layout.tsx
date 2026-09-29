import type { Metadata } from "next";
import { DeliverableFrame } from "@/components/attempts/DeliverableFrame";

export const metadata: Metadata = { title: "08 · Approvals queue · Attempts" };

export default function DeliverableLayout({ children }: LayoutProps<"/challenges/08/deliverable">) {
  return <DeliverableFrame challenge="08">{children}</DeliverableFrame>;
}
