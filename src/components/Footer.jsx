'use client';

import Link from "next/link";
import { Separator } from "@heroui/react";
import { LogoGithub, LogoLinkedin, LogoTelegram } from "@gravity-ui/icons";
import { TvMinimalPlay, Mail, Phone, MapPin } from "lucide-react";

// Official X (formerly Twitter) logo — the correct geometric mark, not the bird
function XLogo({ className }) {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="currentColor"
      className={className}
    >
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.736-8.859L1.254 2.25H8.08l4.253 5.622 5.911-5.622Zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

const socialLinks = [
  {
    label: "X (Twitter)",
    href: "https://x.com/wisdr",
    icon: <XLogo className="w-4 h-4" />,
  },
  {
    label: "GitHub",
    href: "https://github.com/wisdr",
    icon: <LogoGithub className="w-4 h-4" />,
  },
  {
    label: "LinkedIn",
    href: "https://linkedin.com/company/wisdr",
    icon: <LogoLinkedin className="w-4 h-4" />,
  },
  {
    label: "YouTube",
    href: "https://youtube.com/@wisdr",
    icon: <TvMinimalPlay className="w-4 h-4" />,
  },
  {
    label: "Telegram",
    href: "https://t.me/wisdr",
    icon: <LogoTelegram className="w-4 h-4" />,
  },
];

const footerLinks = {
  Product: [
    { label: "Public Lessons", href: "/public-lessons" },
    { label: "Pricing", href: "/pricing" },
    { label: "Update Log", href: "/updates" },
    { label: "Dashboard", href: "/dashboard" },
  ],
  Company: [
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Careers", href: "/careers" },
  ],
  Legal: [
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Refund Policy", href: "/refunds" },
  ],
};

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full border-zinc-800 bg-black text-white border border-t-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Top grid: Brand + link columns */}
        <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-5">

          {/* Brand column — spans 2 cols on large screens */}
          <div className="lg:col-span-2 flex flex-col gap-5">
            {/* Logo & name */}
            <Link href="/" className="flex items-center gap-2 w-fit">
              <span className="bg-blue-600/20 text-blue-400 p-1.5 rounded-md text-sm leading-none select-none">
                📚
              </span>
              <span className="font-bold text-xl tracking-tight">Wisdr</span>
            </Link>

            <p className="text-sm text-zinc-400 leading-relaxed max-w-xs">
              The open platform for creating, sharing, and discovering lessons.
              Built for learners and educators alike.
            </p>

            {/* Contact info */}
            <ul className="flex flex-col gap-2.5 text-sm text-zinc-400">
              <li>
                <a
                  href="mailto:hello@lessonhub.io"
                  className="flex items-center gap-2 hover:text-white transition-colors duration-150"
                >
                  <Mail className="w-4 h-4 shrink-0 text-zinc-500" />
                  wisdr@gmail.com
                </a>
              </li>
              <li>
                <a
                  href="tel:+15550001234"
                  className="flex items-center gap-2 hover:text-white transition-colors duration-150"
                >
                  <Phone className="w-4 h-4 shrink-0 text-zinc-500" />
                  +88 01516560994
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 shrink-0 text-zinc-500 mt-0.5" />
                <span>Jonson Road, Ray Shaheb Bazar, Dhaka</span>
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex items-center gap-3 mt-1">
              {socialLinks.map(({ label, href, icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(footerLinks).map(([heading, links]) => (
            <div key={heading} className="flex flex-col gap-4">
              <p className="text-xs font-semibold uppercase tracking-widest text-zinc-500">
                {heading}
              </p>
              <ul className="flex flex-col gap-2.5">
                {links.map(({ label, href }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className="text-sm text-zinc-400 hover:text-white transition-colors duration-150"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <Separator className="my-8 bg-zinc-800" />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-zinc-600">
          <p>© {currentYear} LessonHub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link href="/terms" className="hover:text-zinc-400 transition-colors duration-150">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-zinc-400 transition-colors duration-150">
              Privacy Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}