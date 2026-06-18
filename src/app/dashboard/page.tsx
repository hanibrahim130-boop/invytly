"use client";

import * as React from "react";
import { Check, X, Clock, Users, Download, Copy, CheckCheck, Calendar, MapPin, Plus } from "lucide-react";
import { Container } from "@/components/ui/container";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  getLatestEvent,
  getAllGuests,
  getRSVPStats,
  exportGuestsCSV,
  addGuest,
  type Guest,
  type RSVPStatus,
} from "@/lib/guest-tracking";
import { cn } from "@/lib/utils";

type Filter = "all" | "attending" | "declined" | "pending";

export default function DashboardPage() {
  const [loaded, setLoaded] = React.useState(false);
  const [event, setEvent] = React.useState<ReturnType<typeof getLatestEvent>>(null);
  const [guests, setGuests] = React.useState<Guest[]>([]);
  const [filter, setFilter] = React.useState<Filter>("all");
  const [copied, setCopied] = React.useState(false);
  const [showAddGuest, setShowAddGuest] = React.useState(false);
  const [newGuestName, setNewGuestName] = React.useState("");
  const [refreshKey, setRefreshKey] = React.useState(0);

  React.useEffect(() => {
    setEvent(getLatestEvent());
    setGuests(getAllGuests());
    setLoaded(true);
  }, [refreshKey]);

  const stats = getRSVPStats();
  const rsvpLink = event ? `${window.location.origin}/rsvp/${event.orderId}` : "";

  const filteredGuests = guests.filter((g) => {
    if (filter === "all") return true;
    return g.status === filter;
  });

  const handleExport = () => {
    const csv = exportGuestsCSV();
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

  const handleAddGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;
    addGuest({
      name: newGuestName,
      plusOnes: 0,
      status: "pending",
      respondedAt: null,
    });
    setNewGuestName("");
    setShowAddGuest(false);
    setRefreshKey((k) => k + 1);
  };

  const formatDate = (d: string) => {
    if (!d) return "—";
    return new Date(d + "T00:00").toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (!loaded) return null;

  if (loaded && !event) {
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
    { id: "attending", label: "Attending", count: stats.attending },
    { id: "declined", label: "Declined", count: stats.declined },
    { id: "pending", label: "Pending", count: stats.pending },
  ];

  return (
    <>
      <Container className="pt-28 pb-6">
        <p className="label-mono text-[color:var(--primary)]">Guest tracking</p>
        <h1 className="mt-4 font-[family-name:var(--font-display)] text-4xl tracking-tight sm:text-5xl">
          Dashboard
        </h1>
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
        <div className="grid grid-cols-2 gap-px bg-[color:var(--border)] md:grid-cols-4">
          {[
            { label: "Total invited", value: stats.total, icon: Users },
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
    pending: { icon: Clock, label: "Pending", className: "border-[color:var(--border)] text-[color:var(--muted-foreground)]" },
  };
  const c = config[status];
  return (
    <span className={cn("inline-flex items-center gap-1.5 border px-2.5 py-1 text-xs font-medium", c.className)}>
      <c.icon className="h-3 w-3" />
      {c.label}
    </span>
  );
}
