import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import { AppNav } from "@/components/AppNav";

type AppShellProps = {
  children: ReactNode;
};

export function AppShell({ children }: AppShellProps) {
  return (
    <div className="min-h-screen bg-[#07080c] text-zinc-100">
      <div className="pointer-events-none fixed inset-0 bg-[radial-gradient(circle_at_top_right,rgba(239,68,68,0.14),transparent_34%),linear-gradient(180deg,rgba(255,255,255,0.035),transparent_26rem)]" />
      <header className="sticky top-0 z-40 border-b border-white/10 bg-[#07080c]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
          <Link href="/" className="group flex items-center gap-3">
            <Image
              src="/brand/lc-karting-cup-logo.png"
              alt="LC Karting Cup"
              width={180}
              height={120}
              priority
              className="h-12 w-36 object-contain object-center sm:h-14 sm:w-44"
            />
          </Link>
          <AppNav variant="top" />
        </div>
      </header>
      <main className="relative mx-auto min-h-[calc(100vh-65px)] w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 md:pb-12 md:pt-8">
        {children}
      </main>
      <AppNav variant="bottom" />
    </div>
  );
}
