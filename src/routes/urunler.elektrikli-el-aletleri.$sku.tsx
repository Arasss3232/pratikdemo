import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/urunler/elektrikli-el-aletleri/$sku")({
  beforeLoad: ({ params }) => {
    throw redirect({
      to: "/urun-detay/$sku",
      params: { sku: params.sku },
      replace: true,
    });
  },
});