import { cn } from "@/lib/utils";
import type { Design, DesignStyle } from "@/lib/mock-data";
import type { GeneratedPalette, GeneratedOrnament } from "@/lib/ai-design-generator";

type Palette = { accent: string; tint: string; ink: string };

const PALETTES: Record<string, Palette> = {
  w1: { accent: "#9f3f49", tint: "#f8efe9", ink: "#2a1f1d" },
  w2: { accent: "#1a1714", tint: "#f1eee9", ink: "#1a1714" },
  w3: { accent: "#6d4f7e", tint: "#efeaf2", ink: "#241c2b" },
  w4: { accent: "#8a8073", tint: "#f5f1ea", ink: "#332f29" },
  e1: { accent: "#b15d74", tint: "#f7ecf0", ink: "#3a2129" },
  e2: { accent: "#b8792c", tint: "#f7efe2", ink: "#3a2c14" },
  b1: { accent: "#7b3f8c", tint: "#f3edf6", ink: "#2c1933" },
  b2: { accent: "#2f7d5b", tint: "#edf5ee", ink: "#143027" },
  b3: { accent: "#b85f27", tint: "#fbefe4", ink: "#3a2410" },
  g1: { accent: "#244f82", tint: "#eef3f8", ink: "#11233a" },
  g2: { accent: "#287fa3", tint: "#edf7fb", ink: "#0f3140" },
  s1: { accent: "#4f8d8a", tint: "#edf7f5", ink: "#1c3534" },
  s2: { accent: "#7b8f4b", tint: "#f2f5e9", ink: "#2f371c" },
  c1: { accent: "#323232", tint: "#eeeeec", ink: "#1a1a1a" },
  c2: { accent: "#3a3b45", tint: "#ececee", ink: "#1f2027" },
  p1: { accent: "#9d2f2f", tint: "#f7ece9", ink: "#341212" },
  p2: { accent: "#54754a", tint: "#eff3e8", ink: "#22311c" },
  cu1: { accent: "#5e4b79", tint: "#f0edf5", ink: "#241c30" },
};

const FALLBACK: Palette = { accent: "#b8390e", tint: "#f4f1ec", ink: "#1a1714" };

export interface EventDetails {
  names?: string;
  eventDate?: string;
  eventTime?: string;
  venue?: string;
  message?: string;
  eventType?: string;
}

function Motif({ style }: { style: DesignStyle }) {
  const common = { stroke: "currentColor", fill: "none", strokeWidth: 1.4 };

  if (style === "floral") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
        {Array.from({ length: 8 }).map((_, i) => (
          <ellipse
            key={i}
            cx="50"
            cy="28"
            rx="6.5"
            ry="17"
            {...common}
            transform={`rotate(${i * 45} 50 50)`}
          />
        ))}
        <circle cx="50" cy="50" r="4.5" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  if (style === "modern") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
        <rect x="26" y="34" width="13" height="50" {...common} />
        <rect x="44" y="20" width="13" height="64" {...common} />
        <rect x="62" y="46" width="13" height="38" {...common} />
      </svg>
    );
  }

  if (style === "glam") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
        <circle cx="50" cy="50" r="30" {...common} />
        <circle cx="50" cy="50" r="20" {...common} strokeWidth={1} />
        <circle cx="50" cy="50" r="10" {...common} strokeWidth={1} />
        {[0, 90, 180, 270].map((a) => (
          <line
            key={a}
            x1="50"
            y1="6"
            x2="50"
            y2="16"
            {...common}
            transform={`rotate(${a} 50 50)`}
          />
        ))}
      </svg>
    );
  }

  if (style === "classic") {
    return (
      <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
        <line x1="14" y1="50" x2="40" y2="50" {...common} />
        <line x1="60" y1="50" x2="86" y2="50" {...common} />
        <rect x="44" y="44" width="12" height="12" {...common} transform="rotate(45 50 50)" />
        <circle cx="22" cy="50" r="1.6" fill="currentColor" stroke="none" />
        <circle cx="78" cy="50" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    );
  }

  // minimal
  return (
    <svg viewBox="0 0 100 100" className="h-full w-full" aria-hidden>
      <line x1="20" y1="50" x2="80" y2="50" {...common} />
      <circle cx="50" cy="50" r="3.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function GeneratedMotif({ ornament }: { ornament: GeneratedOrnament }) {
  return (
    <svg
      viewBox={ornament.viewBox}
      className="h-full w-full"
      aria-hidden
      dangerouslySetInnerHTML={{ __html: ornament.svgPaths }}
    />
  );
}

function formatDateForInvite(d: string): string {
  if (!d) return "";
  const date = new Date(d + "T00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function DesignPreview({
  design,
  className,
  generatedPalette,
  generatedOrnament,
  eventDetails,
}: {
  design: Design;
  className?: string;
  generatedPalette?: GeneratedPalette;
  generatedOrnament?: GeneratedOrnament;
  eventDetails?: EventDetails;
}) {
  const p = generatedPalette ?? PALETTES[design.id] ?? FALLBACK;
  const frame = `color-mix(in srgb, ${p.ink} 28%, transparent)`;
  const hairline = `color-mix(in srgb, ${p.ink} 14%, transparent)`;
  const hasDetails = eventDetails && (eventDetails.names || eventDetails.eventDate);

  return (
    <div
      className={cn("relative h-full w-full overflow-hidden", className)}
      style={{
        background: `linear-gradient(160deg, ${p.tint} 0%, color-mix(in srgb, ${p.tint} 70%, #fefcf9) 100%)`,
        containerType: "size",
        color: p.ink,
      }}
    >
      {/* Frame */}
      <div className="absolute inset-[6%]" style={{ border: `1.5px solid ${frame}` }} />
      <div className="absolute inset-[9%]" style={{ border: `1px solid ${hairline}` }} />

      {/* Content */}
      <div className="relative flex h-full flex-col items-center justify-between px-[12%] py-[11%] text-center">
        <span
          style={{
            color: p.accent,
            fontFamily: "var(--font-mono)",
            fontSize: "3.4cqi",
            letterSpacing: "0.32em",
            fontWeight: 500,
          }}
        >
          {(eventDetails?.eventType ?? design.categoryLabel).toUpperCase()}
        </span>

        <div className="flex flex-1 flex-col items-center justify-center" style={{ gap: "4cqi" }}>
          <div style={{ width: "26cqi", height: "26cqi", color: p.accent }}>
            {generatedOrnament ? (
              <GeneratedMotif ornament={generatedOrnament} />
            ) : (
              <Motif style={design.style} />
            )}
          </div>
          {hasDetails && eventDetails?.names ? (
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "10cqi",
                lineHeight: 1.02,
                letterSpacing: "-0.01em",
                maxWidth: "18ch",
              }}
            >
              {eventDetails.names}
            </h3>
          ) : (
            <h3
              style={{
                fontFamily: "var(--font-display)",
                fontStyle: "italic",
                fontSize: "12cqi",
                lineHeight: 1.02,
                letterSpacing: "-0.01em",
                maxWidth: "16ch",
              }}
            >
              {design.name}
            </h3>
          )}
          {hasDetails && eventDetails?.eventDate && (
            <span
              style={{
                color: `color-mix(in srgb, ${p.ink} 65%, transparent)`,
                fontFamily: "var(--font-mono)",
                fontSize: "2.8cqi",
                letterSpacing: "0.12em",
                fontWeight: 500,
              }}
            >
              {formatDateForInvite(eventDetails.eventDate)}
            </span>
          )}
          {hasDetails && eventDetails?.venue && (
            <span
              style={{
                color: `color-mix(in srgb, ${p.ink} 50%, transparent)`,
                fontFamily: "var(--font-mono)",
                fontSize: "2.4cqi",
                letterSpacing: "0.08em",
                maxWidth: "24ch",
              }}
            >
              {eventDetails.venue}
            </span>
          )}
          {!hasDetails && (
            <span
              style={{
                color: `color-mix(in srgb, ${p.ink} 55%, transparent)`,
                fontFamily: "var(--font-mono)",
                fontSize: "2.7cqi",
                letterSpacing: "0.28em",
                fontWeight: 500,
              }}
            >
              {design.style.toUpperCase()}
            </span>
          )}
        </div>

        <div className="flex items-center" style={{ gap: "2cqi" }}>
          <span style={{ width: "1.4cqi", height: "1.4cqi", background: p.accent, borderRadius: "9999px" }} />
          <span
            style={{
              fontFamily: "var(--font-mono)",
              fontSize: "2.7cqi",
              letterSpacing: "0.42em",
              color: p.accent,
              fontWeight: 600,
            }}
          >
            INVYTY
          </span>
          <span style={{ width: "1.4cqi", height: "1.4cqi", background: p.accent, borderRadius: "9999px" }} />
        </div>
      </div>
    </div>
  );
}
