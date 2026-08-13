import { createFileRoute } from "@tanstack/react-router";
import { SiteHeader } from "@/components/site-shell";

export const Route = createFileRoute("/")({
  component: () => (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="h-[200vh] bg-gray-100 flex items-center justify-center">
        <h1 className="text-4xl">Geri Yükleme Öncesi Kontrol</h1>
      </div>
    </div>
  ),
});
