import { Suspense } from "react";
import HomePageClient from "@/components/HomePageClient";

export default function Page() {
  return (
    <Suspense fallback={<main className="min-h-screen w-full px-6 py-8" />}>
      <HomePageClient />
    </Suspense>
  );
}
