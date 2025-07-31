import type { Metadata } from "next";
import localFont from "next/font/local";
import Providers from "../src/shared/providers";
import "@nugudi/themes/themes.css";

const Pretendard = localFont({
  src: "../node_modules/pretendard/dist/web/variable/woff2/PretendardVariable.woff2",
  display: "swap",
  weight: "45 920",
  adjustFontFallback: false,
  variable: "--font-pretendard",
});

export const metadata: Metadata = {
  title: "너구디",
  description: "너의 구로 디지털단지",
  manifest: "/manifest.json",
  keywords: ["너구디", "너의 구로 디지털단지"],
  authors: [
    {
      name: "너구디",
      url: "https://nugudi.com",
    },
  ],
  icons: [
    { rel: "apple-touch-icon", url: "/images/icons/apple-touch-icon.png" },
    { rel: "icon", url: "/images/icons/favicon.ico" },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning={true}>
      <body className={Pretendard.variable} suppressHydrationWarning={true}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
