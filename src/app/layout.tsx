import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Kestrel practice set",
    template: "%s · Kestrel practice set",
  },
  description: "Ten timed image-to-app React challenges for a fictional fintech company, Kestrel.",
};

// Deliberately bare: mocks and attempts set their own fonts and backgrounds.
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
