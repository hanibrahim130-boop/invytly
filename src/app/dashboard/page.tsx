"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Check, X, Clock, Users, Download, Copy, CheckCheck, Calendar, MapPin, Plus, Eye, Mail } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/auth-context";
import {
  subscribeToClientEvents,
  subscribeToEventGuests,
  addGuestToFirestore,
  computeStats,
  emptyStats,
  exportGuestsCSV,
  type FirestoreEvent,
  type FirestoreGuest,
  type RSVPStatus,
} from "@/lib/firestore";
import { cn } from "@/lib/utils";

type Filter = "all" | "attending" | "declined" | "opened" | "not_opened";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const [events, setEvents] = React.useState<FirestoreEvent[]>([]);
  const [selectedId, setSelectedId] = React.useState<string | null>(null);
  const [guests, setGuests] = React.useState<FirestoreGuest[]>([]);
  const [eventsLoaded, setEventsLoaded] = React.useState(false);
  const [dashboardError, setDashboardError] = React.useState("");
  const [filter, setFilter] = React.useState<Filter>("all");
  const [copied, setCopied] = React.useState(false);
  const [showAddGuest, setShowAddGuest] = React.useState(false);
  const [newGuestName, setNewGuestName] = React.useState("");

  // Auth gate — clients only see their own events
  React.useEffect(() => {
    if (!authLoading && !user) router.replace("/login?redirect=/dashboard");
  }, [authLoading, user, router]);

  // Live subscription to this client's events
  React.useEffect(() => {
    if (!user) return;
    setEventsLoaded(false);
    setDashboardError("");
    const unsub = subscribeToClientEvents(user.uid, (evts) => {
      setEvents(evts);
      setEventsLoaded(true);
      setSelectedId((cur) => cur ?? evts[0]?.orderId ?? null);
    }, (error) => {
      const code = (error as { code?: string }).code ?? "unknown";
      setDashboardError(`Could not load your events (${code}).`);
      setEventsLoaded(true);
    });
    return () => unsub();
  }, [user]);

  // Live subscription to the selected event's guests
  React.useEffect(() => {
    if (!selectedId) return;
    setDashboardError("");
    const unsub = subscribeToEventGuests(selectedId, (g) => setGuests(g), (error) => {
      const code = (error as { code?: string }).code ?? "unknown";
      setDashboardError(`Could not load guests (${code}).`);
    });
    return () => unsub();
  }, [selectedId]);

  const event = events.find((e) => e.orderId === selectedId) ?? null;
  const stats = guests.length ? computeStats(guests) : emptyStats();
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  const rsvpLink = event ? `${origin}/rsvp/${event.orderId}` : "";

  const filteredGuests = guests.filter((g) => (filter === "all" ? true : g.status === filter));

  const handleExport = () => {
    const csv = exportGuestsCSV(guests);
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `guests-${event?.orderId ?? "export"}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(rsvpLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleAddGuest = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim() || !event) return;
    await addGuestToFirestore({
      orderId: event.orderId,
      name: newGuestName.trim(),
      plusOnes: 0,
      status: "not_opened",
      openedAt: null,
      respondedAt: null,
    });
    setNewGuestName("");
    setShowAddGuest(false);
  };

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d + "T00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (authLoading || !user || !eventsLoaded) {
    return (
      <Container className="py-32 text-center">
        <p className="text-sm text-[color:var(--muted-foreground)]">Loading…</p>
      </Container>
    );
  }

  if (dashboardError) {
    return (
      <Container className="py-32 text-center">
        <Users className="mx-auto h-10 w-10 text-[color:var(--muted-foreground)]" />
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl tracking-tight">
          Dashboard unavailable
        </h1>
        <p className="mx-auto mt-4 max-w-md text-[color:var(--muted-foreground)]">
          {dashboardError} Check Firebase rules and try again.
        </p>
        <Button type="button" onClick={() => window.location.reload()} className="mt-8">
          Reload dashboard
        </Button>
      </Container>
    );
  }

  if (events.length === 0) {
    return (
      <Container className="py-32 text-center">
        <Users className="mx-auto h-10 w-10 text-[color:var(--muted-foreground)]" />
        <h1 className="mt-6 font-[family-name:var(--font-display)] text-3xl tracking-tight">
          No active event
        </h1>
        <p className="mt-4 text-[color:var(--muted-foreground)]">
          Once you place an order, your guest tracking dashboard will appear here.
        </p>
        <Button href="/designs" className="mt-8">
          Browse designs
        </Button>
      </Container>
    );
  }

  const FILTERS: { id: Filter; label: string; count: number }[] = [
    { id: "all", label: "All", count: stats.total },
    { id: "not_opened", label: "Not opened", count: stats.notOpened },
    { id: "opened", label: "Opened", count: stats.opened - stats.attending - stats.declined },
    { id: "attending", label: "Attending", count: stats.attending },
    { id: "declined", label: "Declined", count: stats.declined },
  ];

  return (
    <>
      <Container className="pt-28 pb-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="label-mono text-[color:var(--primary)]">Guest tracking</p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight sm:text-5xl">
              Dashboard
            </h1>
          </div>
          {events.length > 1 && (
            <div>
              <Label htmlFor="eventSelect" className="label-mono text-[color:var(--muted-foreground)]">
                Event
              </Label>
              <select
                id="eventSelect"
                value={selectedId ?? ""}
                onChange={(e) => setSelectedId(e.target.value)}
                className="mt-2 block w-full min-w-[220px] border border-[color:var(--foreground)] bg-[color:var(--background)] px-3 py-2 text-sm"
              >
                {events.map((e) => (
                  <option key={e.orderId} value={e.orderId}>
                    {e.names || e.orderId} — {e.orderId}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </Container>

      <div className="rule" />

      {/* Event info + share link */}
      <Container className="py-10">
        <div className="grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div className="border border-[color:var(--foreground)] p-6">
              <p className="label-mono text-[color:var(--muted-foreground)]">Event</p>
              <h2 className="mt-2 font-[family-name:var(--font-display)] text-2xl tracking-tight">
                {event?.names}
              </h2>
              <p className="text-sm text-[color:var(--muted-foreground)]">{event?.eventType}</p>

              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-3.5 w-3.5 text-[color:var(--primary)]" />
                  {formatDate(event?.eventDate ?? "")}
                </div>
                {event?.eventTime && (
                  <div className="flex items-center gap-2 text-sm">
                    <Clock className="h-3.5 w-3.5 text-[color:var(--primary)]" />
                    {event.eventTime}
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm sm:col-span-2">
                  <MapPin className="h-3.5 w-3.5 text-[color:var(--primary)]" />
                  {event?.venue}
                </div>
              </div>
            </div>
          </div>

          {/* Share link */}
          <div className="lg:col-span-5">
            <div className="border border-[color:var(--border)] p-6">
              <p className="label-mono text-[color:var(--primary)]">Share RSVP link</p>
              <p className="mt-3 text-sm text-[color:var(--muted-foreground)]">
                Send this link to your guests via WhatsApp, email, or SMS. Their responses appear here in real time.
              </p>
              <div className="mt-4 flex items-center gap-2">
                <Input
                  readOnly
                  value={rsvpLink}
                  className="text-xs"
                  onFocus={(e) => e.target.select()}
                />
                <Button onClick={handleCopyLink} size="sm" className="shrink-0">
                  {copied ? <CheckCheck className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Container>

      <div className="rule" />

      {/* Stats */}
      <Container className="py-10">
        <div className="grid grid-cols-2 gap-px bg-[color:var(--border)] md:grid-cols-5">
          {[
            { label: "Total invited", value: stats.total, icon: Users },
            { label: "Opened", value: stats.opened, icon: Eye },
            { label: "Attending", value: stats.attending, icon: Check },
            { label: "Declined", value: stats.declined, icon: X },
            { label: "Headcount", value: stats.totalHeadcount, icon: Users },
          ].map((s) => (
            <div key={s.label} className="bg-[color:var(--background)] p-6 text-center">
              <s.icon className="mx-auto h-4 w-4 text-[color:var(--primary)]" />
              <div className="mt-3 font-[family-name:var(--font-display)] text-3xl tracking-tight">
                {s.value}
              </div>
              <p className="label-mono mt-1 text-[color:var(--muted-foreground)]">
                {s.label}
              </p>
            </div>
          ))}
        </div>
      </Container>

      {/* Open rate banner */}
      <Container className="py-6">
        <div className="flex items-center justify-between border border-[color:var(--border)] px-6 py-4">
          <div className="flex items-center gap-3">
            <Eye className="h-5 w-5 text-[color:var(--primary)]" />
            <div>
              <p className="label-mono text-[color:var(--muted-foreground)]">Open rate</p>
              <p className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
                {stats.openRate}%
              </p>
            </div>
          </div>
          <p className="text-sm text-[color:var(--muted-foreground)]">
            {stats.opened} of {stats.total} guests opened their invitation
          </p>
        </div>
      </Container>

      <div className="rule" />

      {/* Guest list */}
      <Container className="py-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <h2 className="font-[family-name:var(--font-display)] text-2xl tracking-tight">
            Guest list
          </h2>
          <div className="flex items-center gap-2">
            <Button onClick={() => setShowAddGuest((v) => !v)} variant="outline" size="sm">
              <Plus className="h-4 w-4" /> Add guest
            </Button>
            <Button onClick={handleExport} variant="outline" size="sm">
              <Download className="h-4 w-4" /> Export CSV
            </Button>
          </div>
        </div>

        {/* Add guest form */}
        {showAddGuest && (
          <form onSubmit={handleAddGuest} className="mt-4 flex items-end gap-3 border border-[color:var(--border)] p-4">
            <div className="flex-1">
              <Label htmlFor="newGuest">Guest name</Label>
              <Input
                id="newGuest"
                value={newGuestName}
                onChange={(e) => setNewGuestName(e.target.value)}
                placeholder="Enter guest name"
                className="mt-2"
                autoFocus
              />
            </div>
            <Button type="submit" size="sm">Add</Button>
            <Button type="button" variant="ghost" size="sm" onClick={() => setShowAddGuest(false)}>
              Cancel
            </Button>
          </form>
        )}

        {/* Filters */}
        <div className="mt-6 flex flex-wrap gap-2">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={cn(
                "flex items-center gap-2 border px-4 py-2 text-xs font-medium transition-colors",
                filter === f.id
                  ? "border-[color:var(--foreground)] bg-[color:var(--foreground)] text-[color:var(--background)]"
                  : "border-[color:var(--border)] hover:border-[color:var(--foreground)]"
              )}
            >
              {f.label}
              <span className={cn(
                "grid h-4 min-w-4 place-items-center px-1 text-[10px]",
                filter === f.id ? "bg-[color:var(--background)] text-[color:var(--foreground)]" : "bg-[color:var(--muted)]"
              )}>
                {f.count}
              </span>
            </button>
          ))}
        </div>

        {/* Guest table */}
        {filteredGuests.length === 0 ? (
          <div className="mt-8 border border-[color:var(--border)] p-12 text-center">
            <Users className="mx-auto h-8 w-8 text-[color:var(--muted-foreground)]" />
            <p className="mt-4 text-sm text-[color:var(--muted-foreground)]">
              {guests.length === 0
                ? "No guests yet. Share your RSVP link to start collecting responses."
                : "No guests match this filter."}
            </p>
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto border border-[color:var(--foreground)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[color:var(--foreground)] bg-[color:var(--card)]">
                  <th className="p-4 text-left label-mono">Name</th>
                  <th className="p-4 text-left label-mono">Status</th>
                  <th className="hidden p-4 text-left label-mono sm:table-cell">Guests</th>
                  <th className="hidden p-4 text-left label-mono md:table-cell">Dietary</th>
                  <th className="hidden p-4 text-left label-mono lg:table-cell">Message</th>
                  <th className="hidden p-4 text-left label-mono lg:table-cell">Responded</th>
                  <th className="hidden p-4 text-left label-mono xl:table-cell">Link</th>
                </tr>
              </thead>
              <tbody>
                {filteredGuests.map((g) => (
                  <tr key={g.id} className="border-b border-[color:var(--border)] last:border-0">
                    <td className="p-4">
                      <div className="font-medium">{g.name}</div>
                      {g.email && <div className="text-xs text-[color:var(--muted-foreground)]">{g.email}</div>}
                    </td>
                    <td className="p-4">
                      <StatusBadge status={g.status} />
                    </td>
                    <td className="hidden p-4 sm:table-cell">
                      {g.status === "attending" ? g.plusOnes + 1 : "—"}
                    </td>
                    <td className="hidden p-4 text-xs text-[color:var(--muted-foreground)] md:table-cell">
                      {g.dietaryNotes || "—"}
                    </td>
                    <td className="hidden max-w-[200px] truncate p-4 text-xs text-[color:var(--muted-foreground)] lg:table-cell">
                      {g.message || "—"}
                    </td>
                    <td className="hidden p-4 text-xs text-[color:var(--muted-foreground)] lg:table-cell">
                      {g.respondedAt
                        ? new Date(g.respondedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })
                        : "—"}
                    </td>
                    <td className="hidden p-4 xl:table-cell">
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(`${origin}/rsvp/${event?.orderId}/${g.id}`);
                        }}
                        className="text-[color:var(--muted-foreground)] transition-colors hover:text-[color:var(--primary)]"
                        aria-label="Copy guest link"
                      >
                        <Copy className="h-3.5 w-3.5" />
                      </button>
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

function StatusBadge({ status }: { status: RSVPStatus }) {
  const config = {
    attending: { icon: Check, label: "Attending", className: "border-[color:var(--primary)] text-[color:var(--primary)]" },
    declined: { icon: X, label: "Declined", className: "border-[color:var(--foreground)] text-[color:var(--foreground)]" },
    opened: { icon: Eye, label: "Opened", className: "border-[color:var(--foreground)] text-[color:var(--muted-foreground)]" },
    not_opened: { icon: Mail, label: "Not opened", className: "border-[color:var(--border)] text-[color:var(--muted-foreground)]" },
  };
  const c = config[status] ?? config.not_opened;
  return (
    <span className={cn("inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-medium", c.className)}>
      <c.icon className="h-3 w-3" />
      {c.label}
    </span>
  );
}
