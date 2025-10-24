import type { Metadata } from "next";
import localFont from "next/font/local";
import { MobileFirstLayout } from "@/src/shared/interface-adapters/components";
import Providers from "../src/shared/interface-adapters/providers/providers";
import "../src/shared/interface-adapters/styles/globals.css";

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
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-icon.png",
  },
};

const RootLayout = ({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) => {
  return (
    <html lang="ko" suppressHydrationWarning={true}>
      <body className={Pretendard.className} suppressHydrationWarning={true}>
        <Providers>
          <MobileFirstLayout>{children}</MobileFirstLayout>
        </Providers>
      </body>
    </html>
  );
};

export default RootLayout;
