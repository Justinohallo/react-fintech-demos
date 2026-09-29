import { Geist, Geist_Mono } from "next/font/google";

// Fonts for the practice shell and the timer only. Each mock loads its own.
export const shellSans = Geist({ subsets: ["latin"], display: "swap" });
export const shellMono = Geist_Mono({ subsets: ["latin"], display: "swap" });
