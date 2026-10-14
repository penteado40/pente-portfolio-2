import Link from "next/link";
import { LegacyHashRedirect } from "@/components/LegacyHashRedirect";

// Provisional Hub: only links to the Audio persona until the full Hub lands.
export default function Hub() {
  return (
    <div data-persona="hub">
      <LegacyHashRedirect />
      <main className="min-h-dvh flex flex-col items-center justify-center gap-6 px-6 text-center">
        <h1 className="text-4xl md:text-5xl font-medium tracking-tight">
          Felipe Penteado
        </h1>
        <Link
          href="/audio"
          className="inline-flex items-center rounded-full border border-ink/20 px-6 py-3 text-sm font-medium hover:ring-2 hover:ring-highlight focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-highlight transition-shadow"
        >
          Audio Engineer
        </Link>
      </main>
    </div>
  );
}
