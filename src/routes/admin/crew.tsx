import { createFileRoute, Navigate } from "@tanstack/react-router";

export const Route = createFileRoute("/admin/crew")({ component: CrewRedirect });

function CrewRedirect() {
  return <Navigate to="/admin/pengguna" replace />;
}
