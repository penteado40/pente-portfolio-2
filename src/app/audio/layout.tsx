import type { Metadata } from "next";
import { TestimonialModalProvider } from "@/components/TestimonialModalProvider";
import { AudioNavbar } from "@/components/AudioNavbar";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Audio Engineer",
  description:
    "Audio engineer portfolio. Mixing, mastering, and sound design.",
};

export default function AudioLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div data-persona="audio">
      <TestimonialModalProvider>
        <AudioNavbar />
        {children}
        <Footer />
      </TestimonialModalProvider>
    </div>
  );
}
