import { CHARACTERS, type Character } from "@/lib/heritage-data";
import { Modal } from "./Modals";

export function MenuScreen({
  onPlayers,
  onSettings,
  onHowTo,
}: {
  onPlayers: () => void;
  onSettings: () => void;
  onHowTo: () => void;
}) {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-4 py-12">
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.18]"
        style={{
          backgroundImage:
            "radial-gradient(circle at 20% 20%, var(--gold) 0 2px, transparent 3px), radial-gradient(circle at 70% 60%, var(--saffron) 0 2px, transparent 3px)",
          backgroundSize: "70px 70px, 90px 90px",
        }}
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-[image:var(--gradient-gold)] opacity-10 blur-3xl" aria-hidden />

      <div className="relative z-10 w-full max-w-xl text-center">
        <div className="mx-auto mb-6 h-px w-40 bg-[image:var(--gradient-gold)]" />
        <p className="mb-3 text-xs uppercase tracking-[0.5em] text-gold/80">Est. Bharat</p>
        <h1 className="hx-title animate-shimmer text-5xl leading-tight sm:text-7xl">HERITAGEX</h1>
        <p className="mt-4 text-sm text-parchment/80 sm:text-base">
          A Journey Through India's Heritage &amp; History
        </p>
        <div className="mx-auto mt-6 h-px w-64 bg-[image:var(--gradient-gold)]" />

        <div className="mt-10 flex flex-col gap-4">
          <button className="hx-btn hx-btn-gold text-base sm:text-lg" onClick={onPlayers}>
            NUMBER OF PLAYERS
          </button>
          <button className="hx-btn text-base sm:text-lg" onClick={onSettings}>
            SETTINGS
          </button>
          <button className="hx-btn text-base sm:text-lg" onClick={onHowTo}>
            HOW TO PLAY
          </button>
        </div>
      </div>
    </main>
  );
}

export function PlayerCountModal({
  open,
  value,
  onSelect,
  onClose,
}: {
  open: boolean;
  value: number | null;
  onSelect: (n: number) => void;
  onClose: () => void;
}) {
  return (
    <Modal open={open} onClose={onClose} title="Choose Number of Players">
      <div className="grid gap-3">
        {[2, 3, 4].map((n) => (
          <button
            key={n}
            className={`hx-btn text-lg ${value === n ? "hx-btn-gold" : ""}`}
            onClick={() => onSelect(n)}
          >
            {n} PLAYERS
          </button>
        ))}
      </div>
    </Modal>
  );
}

export function CharacterSelect({
  playerIndex,
  playerCount,
  taken,
  onPick,
  onStart,
  picked,
  onBack,
}: {
  playerIndex: number;
  playerCount: number;
  taken: string[];
  onPick: (c: Character) => void;
  onStart: () => void;
  picked: Character[];
  onBack: () => void;
}) {
  const done = picked.length === playerCount;
  return (
    <main className="min-h-screen px-4 py-10">
      <div className="mx-auto max-w-6xl text-center">
        <h1 className="hx-title text-3xl sm:text-5xl">Choose Your Historical Character</h1>
        <p className="mt-3 font-display text-lg text-gold">
          {done ? "All players ready!" : `Player ${playerIndex + 1} — Choose Your Character`}
        </p>

        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CHARACTERS.map((c) => {
            const used = taken.includes(c.id);
            return (
              <button
                key={c.id}
                disabled={used || done}
                onClick={() => onPick(c)}
                className={`hx-frame group relative flex flex-col items-center overflow-hidden rounded-3xl bg-[image:var(--gradient-royal)] p-5 transition-transform duration-300 ${
                  used ? "opacity-45 grayscale" : "hover:-translate-y-2 hover:[transform:perspective(900px)_rotateX(6deg)_translateY(-8px)]"
                }`}
              >
                <span className="pointer-events-none absolute inset-2 rounded-2xl border border-gold/25" />
                <img
                  src={c.image}
                  alt={c.name}
                  width={512}
                  height={512}
                  loading="lazy"
                  className="h-40 w-auto drop-shadow-[0_16px_24px_oklch(0_0_0/70%)] transition-transform duration-300 group-hover:scale-110"
                />
                <h3 className="mt-3 text-base text-gold">{c.name}</h3>
                <p className="mt-2 text-xs leading-relaxed text-parchment/75">{c.description}</p>
                <span className="mt-4 rounded-lg border border-gold-deep px-4 py-1.5 text-xs uppercase tracking-widest text-parchment">
                  {used ? "Taken" : "Select"}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <button className="hx-btn" onClick={onBack}>
            BACK
          </button>
          <button className="hx-btn hx-btn-gold text-lg" disabled={!done} onClick={onStart}>
            START JOURNEY
          </button>
        </div>
      </div>
    </main>
  );
}
