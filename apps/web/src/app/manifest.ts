import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "너구디",
    short_name: "너구디",
    description: "너의 구로 디지털단지",
    start_url: "/",
    display: "standalone",
    background_color: "#fff",
    theme_color: "#fff",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
      {
        src: "/images/icons/192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/images/icons/512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
    orientation: "any",
    dir: "auto",
    lang: "ko-KR",
  };
}
