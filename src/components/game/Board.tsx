import { DESTINATIONS, DESTINATION_TILES, TILE_COUNT, spiralPositions } from "@/lib/heritage-data";
import type { Player } from "@/lib/game-types";

const POSITIONS = spiralPositions();

export function Board({ players, activeId }: { players: Player[]; activeId: string }) {
  return (
    <div className="board-surface relative aspect-square w-full rounded-full">
      {/* decorative rings */}
      <div className="pointer-events-none absolute inset-[3%] rounded-full border border-gold/20" />
      <div className="pointer-events-none absolute inset-[16%] rounded-full border border-gold/15" />
      <div className="pointer-events-none absolute inset-[30%] rounded-full border border-gold/10" />

      {/* spiral path line */}
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <polyline
          points={POSITIONS.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="var(--gold)"
          strokeOpacity="0.35"
          strokeWidth="3.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points={POSITIONS.map((p) => `${p.x},${p.y}`).join(" ")}
          fill="none"
          stroke="var(--saffron)"
          strokeOpacity="0.25"
          strokeWidth="1"
          strokeDasharray="1 2"
        />
      </svg>

      {POSITIONS.map((pos, i) => {
        const destId = DESTINATION_TILES[i];
        const dest = destId ? DESTINATIONS[destId] : undefined;
        const isCentre = i === TILE_COUNT - 1;
        const isStart = i === 0;
        return (
          <div
            key={i}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
          >
            {isCentre ? (
              <div className="hx-frame grid h-[clamp(46px,13vw,86px)] w-[clamp(46px,13vw,86px)] place-items-center rounded-full bg-[image:var(--gradient-gold)] text-center animate-shimmer">
                <span className="font-display text-[clamp(7px,1.6vw,11px)] font-bold leading-tight text-maroon">
                  BHARAT
                  <br />
                  CENTRE
                </span>
              </div>
            ) : dest ? (
              <div className="hx-frame grid h-[clamp(26px,6.6vw,46px)] w-[clamp(26px,6.6vw,46px)] place-items-center rounded-xl bg-[image:var(--gradient-gold)] shadow-lg">
                <span className="text-[clamp(11px,2.6vw,20px)] leading-none">{dest.icon}</span>
                <span className="pointer-events-none absolute left-1/2 top-full mt-0.5 w-[70px] -translate-x-1/2 text-center text-[8px] font-semibold uppercase tracking-wide text-gold sm:w-[92px] sm:text-[9px]">
                  {dest.name}
                </span>
              </div>
            ) : (
              <div
                className={`grid h-[clamp(18px,4.6vw,32px)] w-[clamp(18px,4.6vw,32px)] place-items-center rounded-lg border border-gold/40 ${
                  isStart ? "bg-teal/40" : "bg-[oklch(0.3_0.06_38)]"
                } shadow-[0_4px_8px_-4px_oklch(0_0_0/60%)]`}
              >
                {isStart && (
                  <span className="absolute -left-1 top-full mt-0.5 w-16 text-center text-[8px] font-bold uppercase text-teal">
                    Start
                  </span>
                )}
              </div>
            )}

            {/* player tokens on this tile */}
            <div className="pointer-events-none absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-[85%] gap-[1px]">
              {players
                .filter((p) => p.pos === i)
                .map((p, k, arr) => (
                  <img
                    key={p.id}
                    src={p.character.image}
                    alt={p.character.name}
                    width={512}
                    height={512}
                    loading="lazy"
                    className={`h-[clamp(22px,5.4vw,42px)] w-auto drop-shadow-[0_4px_6px_oklch(0_0_0/70%)] transition-transform ${
                      p.id === activeId ? "scale-125 animate-glow-pulse rounded-full" : ""
                    }`}
                    style={{
                      marginLeft: k > 0 ? "-40%" : undefined,
                      zIndex: arr.length - k,
                    }}
                  />
                ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
