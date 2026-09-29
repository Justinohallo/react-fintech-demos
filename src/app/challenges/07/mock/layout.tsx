import type { Metadata } from "next";
import { MockFrame } from "@/components/mock/MockFrame";

export const metadata: Metadata = { title: "07 · Expense report · Mock" };

export default function MockLayout({ children }: LayoutProps<"/challenges/07/mock">) {
  return <MockFrame challenge="07">{children}</MockFrame>;
}
