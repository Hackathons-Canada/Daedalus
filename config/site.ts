export const siteConfig = {
  metadataBase: new URL("https://app.hackcanada.org"),
  title: "Hack Canada",
  description:
    "First hackathon Hosted by Hackathons Canada, the biggest hacker community in Canada of 3000 members.",
  openGraph: {
    images: [
      {
        url: "/opengraph-image.png",
        width: 1500,
        height: 1000,
        alt: "Hack Canada",
      },
    ],
  },
  keywords: [
    "hackathon",
    "canada",
    "programming",
    "coding",
    "hackers",
    "technology",
    "innovation",
  ],
};

// TODO: Add links once they are ready
export const discordInviteUrl = "";
export const hackerPackageUrl = "";

export const eventDate = new Date("2025-02-21T16:30:00-05:00");
export const hackerApplicationDeadline = new Date("2025-02-10T23:59:59-05:00");
