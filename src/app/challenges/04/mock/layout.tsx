import type { Metadata } from "next";
import { MockFrame } from "@/components/mock/MockFrame";

export const metadata: Metadata = { title: "04 · Send a payment · Mock" };

export default function MockLayout({ children }: LayoutProps<"/challenges/04/mock">) {
  return <MockFrame challenge="04">{children}</MockFrame>;
}
