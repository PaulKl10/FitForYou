import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Fit For You",
    short_name: "FitForYou",
    description: "Suivi de séances de gym — exercices, séries, progression.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#191919",
    theme_color: "#f26522",
    orientation: "portrait",
    icons: [
      {
        src: "/fit-for-you-01.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/fit-for-you-02.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/fit-for-you-02.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
