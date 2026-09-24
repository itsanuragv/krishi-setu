import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = "https://krishi-setu-lovat.vercel.app";

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/consumer", "/farmer", "/buyer", "/delivery", "/login"],
        disallow: [
          "/admin",
          "/admin/*",
          "/api/*",
          "/verify-otp",
          "/*/cart-order",
          "/*/disputes/*",
        ],
      },
      {
        userAgent: "Googlebot",
        allow: ["/", "/consumer", "/farmer", "/buyer", "/delivery"],
        disallow: ["/admin", "/admin/*", "/api/*"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
