import { Gavel, Lightbulb, LucideIcon, User } from "lucide-react";

export type Application = {
  title: string;
  href: string;
  status: "open" | "closed" | "coming soon";
  disabled: boolean;
  deadline?: string;
  description: string;
  icon: LucideIcon;
};

export const applications: Application[] = [
  {
    title: "Hacker Applications",
    href: "/applications/hacker",
    status: "open",
    deadline: "TBD",
    description: "Submit your application to join as a participant.",
    icon: User,
    disabled: false,
  },
  {
    title: "Mentor Applications",
    href: "/application/mentor",
    status: "coming soon",
    deadline: "TBD",
    description: "Apply to mentor participants during the hackathon.",
    icon: Lightbulb,
    disabled: true,
  },
  {
    title: "Judge Applications",
    href: "/application/judge",
    status: "coming soon",
    description: "Help evaluate and reward the best projects.",
    deadline: "TBD",
    icon: Gavel,
    disabled: true,
  },
];

// TODO: Update to the correct deadline
export const hackerApplicationDeadline = new Date("2025-02-30T23:59:00-05:00");
