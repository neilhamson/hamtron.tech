import type { MetadataRoute } from "next";

const siteUrl = "https://hamson.tech";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: `${siteUrl}/half-echo`,
      lastModified: "2026-11-01",
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/anna`,
      lastModified: "2026-11-01",
      changeFrequency: "weekly",
      priority: 0.7,
    },
    {
      url: siteUrl,
      lastModified: "2026-09-14",
      changeFrequency: "weekly",
      priority: 1,
    },
    {
      url: `${siteUrl}/tron`,
      lastModified: "2026-09-14",
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${siteUrl}/bitcoin`,
      lastModified: "2026-09-25",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/bitcoin/gbp`,
      lastModified: "2026-09-25",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/bitcoin/fractions-satoshis`,
      lastModified: "2026-09-27",
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/bitcoin/fees`,
      lastModified: "2026-09-28",
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/bitcoin/wallets`,
      lastModified: "2026-09-28",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/bitcoin/mining`,
      lastModified: "2026-09-25",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/services`,
      lastModified: "2026-09-28",
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${siteUrl}/about-us`,
      lastModified: "2026-09-28",
      changeFrequency: "monthly",
      priority: 0.7,
    },
    {
      url: `${siteUrl}/contact-us`,
      lastModified: "2026-09-14",
      changeFrequency: "yearly",
      priority: 0.6,
    },
  ];
}
