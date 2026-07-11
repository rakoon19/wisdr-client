import Link from "next/link";
import { BookOpen, Users, Zap, ArrowRight } from "lucide-react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { getSession } from "@/actions/session";

const features = [
  {
    icon: BookOpen,
    title: "Share Lessons",
    description:
      "Publish structured lessons and notes that anyone in your batch or the public can browse and learn from.",
  },
  {
    icon: Users,
    title: "Built for Classes",
    description:
      "Organize by course, section, or session — designed around how university batches actually study together.",
  },
  {
    icon: Zap,
    title: "Fast & Free to Start",
    description:
      "No setup friction. Create an account, publish your first lesson, and you're live in minutes.",
  },
];

export default async function Home() {
  const session = await getSession();
  const isLoggedIn = !!session?.session?.token;

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section className="mx-auto max-w-7xl px-4 pb-20 pt-20 sm:px-6 sm:pt-28 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-zinc-400">
            Now live for public lessons
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight sm:text-6xl">
            Learn together,{" "}
            <span className="bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              share what you know
            </span>
          </h1>

          <p className="mt-6 text-lg leading-relaxed text-zinc-400">
            Wisdr is where lessons, notes, and study material actually get
            shared — not lost in chat threads. Publish, browse, and learn
            from your batch and beyond.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            {isLoggedIn ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-blue-500"
              >
                Go to Dashboard
                <ArrowRight className="size-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex items-center justify-center gap-1 rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-blue-500"
                >
                  Get Started Free
                  <ArrowRight className="size-4" />
                </Link>
                <Link
                  href="/public"
                  className="inline-flex items-center justify-center rounded-lg border border-zinc-700 px-8 py-3 text-base font-medium text-zinc-300 transition-colors hover:border-zinc-500 hover:text-white"
                >
                  Browse Public Lessons
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-zinc-800 bg-zinc-950/50">
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Everything you need to study smarter
            </h2>
            <p className="mt-4 text-zinc-400">
              A lightweight space to publish and find lessons — no clutter,
              no noise.
            </p>
          </div>

          <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {features.map(({ icon: Icon, title, description }) => (
              <div
                key={title}
                className="rounded-2xl border border-zinc-800 bg-black p-6 transition-colors hover:border-zinc-700"
              >
                <div className="flex size-10 items-center justify-center rounded-lg bg-blue-600/20 text-blue-400">
                  <Icon className="size-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                  {description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      {!isLoggedIn && (
        <section className="border-t border-zinc-800">
          <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">
              Ready to start sharing?
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-zinc-400">
              Create your free account and publish your first lesson today.
            </p>
            <div className="mt-8">
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-8 py-3 text-base font-medium text-white transition-colors hover:bg-blue-500"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </section>
      )}


      <ToastContainer position="top-right" autoClose={4000} theme="dark" />
    </div>
  );
}