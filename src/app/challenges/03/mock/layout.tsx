import type { Metadata } from "next";
import { MockFrame } from "@/components/mock/MockFrame";

export const metadata: Metadata = { title: "03 · Card controls · Mock" };

export default function MockLayout({ children }: LayoutProps<"/challenges/03/mock">) {
  return <MockFrame challenge="03">{children}</MockFrame>;
}
