import type { Metadata } from "next";
import { MockFrame } from "@/components/mock/MockFrame";

export const metadata: Metadata = { title: "02 · Plan picker · Mock" };

export default function MockLayout({ children }: LayoutProps<"/challenges/02/mock">) {
  return <MockFrame challenge="02">{children}</MockFrame>;
}
