import type { Metadata } from "next";
import { MockFrame } from "@/components/mock/MockFrame";

export const metadata: Metadata = { title: "10 · Transactions · Mock" };

export default function MockLayout({ children }: LayoutProps<"/challenges/10/mock">) {
  return <MockFrame challenge="10">{children}</MockFrame>;
}
