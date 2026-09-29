import type { Metadata } from "next";
import { DeliverableFrame } from "@/components/attempts/DeliverableFrame";

export const metadata: Metadata = { title: "02 · Plan picker · Attempts" };

export default function DeliverableLayout({ children }: LayoutProps<"/challenges/02/deliverable">) {
  return <DeliverableFrame challenge="02">{children}</DeliverableFrame>;
}
