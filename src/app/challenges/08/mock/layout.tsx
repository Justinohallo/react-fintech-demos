import type { Metadata } from "next";
import { MockFrame } from "@/components/mock/MockFrame";

export const metadata: Metadata = { title: "08 · Approvals queue · Mock" };

export default function MockLayout({ children }: LayoutProps<"/challenges/08/mock">) {
  return <MockFrame challenge="08">{children}</MockFrame>;
}
