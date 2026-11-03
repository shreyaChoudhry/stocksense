
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "StockSense | Know What Sells. Predict What's Next.",
  description:
    "AI-powered retail intelligence, inventory management and demand forecasting.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
