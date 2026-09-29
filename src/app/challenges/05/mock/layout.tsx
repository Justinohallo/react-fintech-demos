import type { Metadata } from "next";
import { MockFrame } from "@/components/mock/MockFrame";

export const metadata: Metadata = { title: "05 · Bitcoin treasury · Mock" };

export default function MockLayout({ children }: LayoutProps<"/challenges/05/mock">) {
  return <MockFrame challenge="05">{children}</MockFrame>;
}
