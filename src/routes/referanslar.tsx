import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/referanslar")({
  loader: () => {
    throw redirect({
      to: "/bayiliklerimiz",
      replace: true,
    });
  },
});
