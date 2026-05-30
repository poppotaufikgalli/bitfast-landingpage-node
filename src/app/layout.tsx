import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bitfast ISP | Koneksi Internet Fiber Optik Tercepat & Stabil",
  description:
    "Bitfast.id menyediakan layanan internet broadband fiber optik unlimited tanpa batas kuota (FUP) untuk rumah dan bisnis. Nikmati internet super cepat sekarang!",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>
        {children}
      </body>
    </html>
  );
}
