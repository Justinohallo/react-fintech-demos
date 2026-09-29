import type { Metadata } from "next";
import { MockFrame } from "@/components/mock/MockFrame";

export const metadata: Metadata = { title: "01 · Treasury balance · Mock" };

export default function MockLayout({ children }: LayoutProps<"/challenges/01/mock">) {
  return <MockFrame challenge="01">{children}</MockFrame>;
}
