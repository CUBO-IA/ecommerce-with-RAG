import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import { CartProvider } from "@/src/cart/CartProvider";
import { ChatWidget } from "@/src/components/ChatWidget";
import { SiteHeader } from "@/src/components/SiteHeader";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700"],
});

export const metadata: Metadata = {
  title: "Mini tienda",
  description: "Catálogo de productos con asesor de compra",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="es" className={`${roboto.variable} h-full antialiased`}>
      <body className="flex min-h-full flex-col bg-white font-sans text-ink">
        <CartProvider>
          <SiteHeader />
          {children}
          <ChatWidget />
        </CartProvider>
      </body>
    </html>
  );
}
