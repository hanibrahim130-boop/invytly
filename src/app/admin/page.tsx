"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  Users,
  Calendar,
  DollarSign,
  TrendingUp,
  LogOut,
  Search,
  Eye,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/lib/auth-context";
import {
  subscribeToAllEvents,
  subscribeToAllGuests,
  type FirestoreEvent,
  type FirestoreGuest,
} from "@/lib/firestore";
import { formatCurrency, cn } from "@/lib/utils";

export default function AdminDashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading, logOut } = useAuth();
  const [events, setEvents] = React.useState<FirestoreEvent[]>([]);
  const [guests, setGuests] = React.useState<FirestoreGuest[]>([]);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<"all" | "active" | "completed" | "draft">("all");

  React.useEffect(() => {
    if (!authLoading && (!user || user.role !== "admin")) {
      router.push("/login?redirect=/admin");
    }
  }, [authLoading, user, router]);

  React.useEffect(() => {
    if (!user || user.role !== "admin") return;
    const unsubEvents = subscribeToAllEvents((data) => setEvents(data));
    const unsubGuests = subscribeToAllGuests((data) => setGuests(data));
    return () => {
      unsubEvents();
      unsubGuests();
    };
  }, [user]);

  if (authLoading || !user) {
    return (
      <Container className="py-32 text-center">
        <p className="text-sm text-[color:var(--muted-foreground)]">Loading…</p>
      </Container>
    );
  }

  // Stats
  const totalRevenue = events.reduce((sum, e) => sum + (e.price ?? 0), 0);
  const activeCount = events.filter((e) => e.status === "active").length;
  const uniqueClients = new Set(events.map((e) => e.clientId || e.contactEmail)).size;

  // Guest aggregation (per event + global headcount)
  const attendingByEvent = React.useMemo(() => {
    const map: Record<string, number> = {};
    for (const g of guests) {
      if (g.status === "attending") {
        map[g.orderId] = (map[g.orderId] ?? 0) + 1 + (g.plusOnes ?? 0);
      }
    }
    return map;
  }, [guests]);
  const totalHeadcount = Object.values(attendingByEvent).reduce((sum, n) => sum + n, 0);
  const totalRSVPs = guests.length;

  // Filtered events
  const filteredEvents = events.filter((e) => {
    if (filter !== "all" && e.status !== filter) return false;
    if (search) {
      const q = search.toLowerCase();
      return (
        e.names?.toLowerCase().includes(q) ||
        e.contactName?.toLowerCase().includes(q) ||
        e.contactEmail?.toLowerCase().includes(q) ||
        e.orderId?.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const handleLogout = async () => {
    await logOut();
    router.push("/");
  };

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const stats = [
    { label: "Total revenue", value: formatCurrency(totalRevenue), icon: DollarSign },
    { label: "Active events", value: activeCount, icon: TrendingUp },
    { label: "Total RSVPs", value: totalRSVPs, icon: CheckCircle2 },
    { label: "Headcount", value: totalHeadcount, icon: Users },
    { label: "Clients", value: uniqueClients, icon: Users },
  ];

  const filters: { id: typeof filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
    { id: "draft", label: "Draft" },
  ];

  return (
    <>
      {/* Top bar */}
      <Container className="pt-8 pb-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="label-mono text-[color:var(--primary)]">Admin</p>
            <h1 className="mt-2 font-[family-name:var(--font-display)] text-3xl tracking-tight sm:text-4xl">
              Dashboard
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-[color:var(--muted-foreground)] sm:block">
              {user.email}
            </span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4" /> Logout
            </Button>
          </div>
        </div>
      </Container>

      <div className="rule" />

      {/* Stats */}
      <Container className="py-8">
        <div className="grid grid-cols-2 gap-px bg-[color:var(--border)] md:grid-cols-5">
          {stats.map((s) => (
            <div key={s.label} className="bg-[color:var(--background)] p-6">
              <div className="flex items-center gap-2">
                <s.icon className="h-4 w-4 text-[color:var(--primary)]" />
                <p className="label-mono text-[color:var(--muted-foreground)]">{s.label}</p>
              </div>
              <div className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight">
                {s.value}
              </div>
            </div>
          ))}
        </div>
      </Container>

      <div className="rule" />

      {/* Events table */}
      <Container className="py-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
            All events ({events.length})
          </h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[color:var(--muted-foreground)]" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name, email, order ID…"
              className="pl-10"
            />
          </div>
        </div>

        {/* Filters */}
        <div className="mt-4 flex flex-wrap gap-2">
          {filters.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "border px-4 py-2 text-xs font-medium transition-colors",
                filter === f.id
                  ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]"
                  : "border-[color:var(--border)] hover:border-[color:var(--foreground)]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {filteredEvents.length === 0 ? (
          <div className="mt-8 border border-[color:var(--border)] p-12 text-center">
            <Calendar className="mx-auto h-8 w-8 text-[color:var(--muted-foreground)]" />
            <p className="mt-4 text-sm text-[color:var(--muted-foreground)]">
              {events.length === 0
                ? "No events yet. Orders will appear here in real time."
                : "No events match your search."}
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto border border-[color:var(--foreground)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--foreground)] bg-[color:var(--card)]">
                  <th className="p-4 text-left label-mono">Order ID</th>
                  <th className="p-4 text-left label-mono">Client</th>
                  <th className="p-4 text-left label-mono">Event</th>
                  <th className="hidden p-4 text-left label-mono sm:table-cell">Date</th>
                  <th className="hidden p-4 text-left label-mono md:table-cell">Tier</th>
                  <th className="hidden p-4 text-right label-mono md:table-cell">Price</th>
                  <th className="p-4 text-right label-mono">Attending</th>
                  <th className="p-4 text-left label-mono">Status</th>
                  <th className="hidden p-4 text-left label-mono lg:table-cell">Created</th>
                </tr>
              </thead>
              <tbody>
                {filteredEvents.map((e) => (
                  <tr key={e.orderId} className="border-b border-[color:var(--border)] last:border-0">
                    <td className="p-4">
                      <span className="font-[family-name:var(--font-mono)] text-xs font-bold tracking-wider">
                        {e.orderId}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{e.contactName || "—"}</div>
                      <div className="text-xs text-[color:var(--muted-foreground)]">{e.contactEmail || ""}</div>
                    </td>
                    <td className="p-4">
                      <div className="font-medium">{e.names || "—"}</div>
                      <div className="text-xs text-[color:var(--muted-foreground)]">{e.eventType || ""}</div>
                    </td>
                    <td className="hidden p-4 sm:table-cell">{formatDate(e.eventDate)}</td>
                    <td className="hidden p-4 md:table-cell">
                      <span className="text-xs uppercase tracking-wider">{e.tier || "—"}</span>
                    </td>
                    <td className="hidden p-4 text-right md:table-cell font-medium">
                      {e.price ? formatCurrency(e.price) : "—"}
                    </td>
                    <td className="p-4 text-right font-medium">
                      {attendingByEvent[e.orderId] ?? 0}
                    </td>
                    <td className="p-4">
                      <StatusPill status={e.status} />
                    </td>
                    <td className="hidden p-4 text-xs text-[color:var(--muted-foreground)] lg:table-cell">
                      {e.createdAt ? formatDate(e.createdAt) : "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Container>
    </>
  );
}

function StatusPill({ status }: { status: FirestoreEvent["status"] }) {
  const config = {
    active: { label: "Active", className: "border-[color:var(--primary)] text-[color:var(--primary)]" },
    completed: { label: "Completed", className: "border-[color:var(--foreground)] text-[color:var(--foreground)]" },
    draft: { label: "Draft", className: "border-[color:var(--border)] text-[color:var(--muted-foreground)]" },
  };
  const c = config[status] ?? config.draft;
  return (
    <span className={cn("inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-medium", c.className)}>
      {status === "active" && <Clock className="h-3 w-3" />}
      {status === "completed" && <CheckCircle2 className="h-3 w-3" />}
      {status === "draft" && <Eye className="h-3 w-3" />}
      {c.label}
    </span>
  );
}
