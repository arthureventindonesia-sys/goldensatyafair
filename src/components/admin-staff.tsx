import { Link } from "@tanstack/react-router";
import { createContext, useContext, type ReactNode } from "react";
import type { AdminDashboard } from "@/lib/tickets/server";

export type StaffContextValue = {
  token: string;
  dash: AdminDashboard | null;
  checking: boolean;
  reload: () => Promise<void>;
};

const StaffContext = createContext<StaffContextValue | null>(null);

export function StaffProvider({
  value,
  children,
}: {
  value: StaffContextValue;
  children: ReactNode;
}) {
  return <StaffContext.Provider value={value}>{children}</StaffContext.Provider>;
}

export function useStaff() {
  const ctx = useContext(StaffContext);
  if (!ctx) {
    return {
      token: "",
      dash: null,
      checking: true,
      reload: async () => undefined,
    };
  }
  return ctx;
}

export function RoleOnly({
  roles,
  children,
}: {
  roles: Array<"admin" | "crew" | "agent">;
  children: ReactNode;
}) {
  const { dash, checking } = useStaff();
  if (checking || !dash) {
    return <p className="text-sm text-muted-foreground">Memeriksa sesi…</p>;
  }
  if (!roles.includes(dash.role)) {
    return (
      <p className="text-sm text-muted-foreground">
        Anda tidak punya akses ke halaman ini.{" "}
        <Link to="/admin" className="underline-offset-4 hover:underline">
          Kembali ke dashboard
        </Link>
      </p>
    );
  }
  return children;
}

export function AdminOnly({ children }: { children: ReactNode }) {
  return <RoleOnly roles={["admin"]}>{children}</RoleOnly>;
}
