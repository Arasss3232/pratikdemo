import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/markalar")({
  loader: () => {
    throw redirect({ to: "/bayiliklerimiz", replace: true });
  },
});
