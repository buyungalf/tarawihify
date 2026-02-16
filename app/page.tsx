import { Suspense } from "react";
import HomePageClient from "@/components/HomePageClient";

export default function HomePage() {
  return (
    <main className="min-h-screen w-full px-6 py-8">
      <div className="mx-auto w-full max-w-5xl">
        <Suspense fallback={<div className="min-h-screen w-full px-6 py-8 flex items-center justify-center">Loading...</div>}>
          <HomePageClient />
        </Suspense>
      </div>
    </main>
  );
}
