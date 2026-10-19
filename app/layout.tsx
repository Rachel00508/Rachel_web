import type { Metadata } from "next";
import { CartProvider } from "@/components/cart-provider";
import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import "./globals.css";

export const metadata: Metadata = { title: { default: "Rachel Parfums | Fragrance for the Art of Being", template: "%s | Rachel Parfums" }, description: "Discover modern fragrances for the moments that make you, you. Rachel Parfums demo storefront." };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body><CartProvider><Header/><main>{children}</main><Footer/></CartProvider></body></html>; }
