"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cx } from "@/lib/ui";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/standings", label: "Standings" },
  { href: "/drivers", label: "Drivers" },
  { href: "/rounds", label: "Rounds" },
  { href: "/rules", label: "Rules" },
];

type AppNavProps = {
  variant: "top" | "bottom";
};

export function AppNav({ variant }: AppNavProps) {
  const pathname = usePathname();

  return (
    <nav
      aria-label={variant === "top" ? "Primary navigation" : "Mobile navigation"}
      className={cx(
        variant === "top"
          ? "hidden items-center gap-1 md:flex"
          : "fixed inset-x-0 bottom-0 z-50 grid grid-cols-5 border-t border-white/10 bg-[#08090d]/95 px-2 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-2 backdrop-blur md:hidden",
      )}
    >
      {navItems.map((item) => {
        const isActive =
          item.href === "/" ? pathname === item.href : pathname.startsWith(item.href);

        return (
          <Link
            key={item.href}
            href={item.href}
            className={cx(
              "relative rounded-md py-2 text-center font-black uppercase transition",
              variant === "top"
                ? "px-3 text-[0.68rem] tracking-[0.18em]"
                : "px-1 text-[0.62rem] tracking-[0.1em]",
              isActive
                ? "bg-red-500 text-white shadow-[0_0_24px_rgba(239,68,68,0.22)]"
                : "text-zinc-400 hover:bg-white/5 hover:text-white",
            )}
          >
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
