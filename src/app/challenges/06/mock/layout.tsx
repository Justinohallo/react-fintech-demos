import type { Metadata } from "next";
import { MockFrame } from "@/components/mock/MockFrame";

export const metadata: Metadata = { title: "06 · Budgets · Mock" };

export default function MockLayout({ children }: LayoutProps<"/challenges/06/mock">) {
  return <MockFrame challenge="06">{children}</MockFrame>;
}
