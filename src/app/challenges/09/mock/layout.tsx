import type { Metadata } from "next";
import { MockFrame } from "@/components/mock/MockFrame";

export const metadata: Metadata = { title: "09 · Spend analytics · Mock" };

export default function MockLayout({ children }: LayoutProps<"/challenges/09/mock">) {
  return <MockFrame challenge="09">{children}</MockFrame>;
}
