import type { Metadata } from "next";
import { DeliverableFrame } from "@/components/attempts/DeliverableFrame";

export const metadata: Metadata = { title: "05 · Bitcoin treasury · Attempts" };

export default function DeliverableLayout({ children }: LayoutProps<"/challenges/05/deliverable">) {
  return <DeliverableFrame challenge="05">{children}</DeliverableFrame>;
}
