import { createFileRoute, Navigate } from "@tanstack/react-router";
import { normalizeReferral } from "@/lib/referral";

export const Route = createFileRoute("/login")({
  validateSearch: (s: Record<string, unknown>): { ref?: string } => {
    const ref = normalizeReferral(String(s.ref ?? ""));
    return ref ? { ref } : {};
  },
  component: LoginRedirect,
});

function LoginRedirect() {
  const { ref } = Route.useSearch();
  return <Navigate to="/checkout" search={ref ? { ref } : {}} />;
}
