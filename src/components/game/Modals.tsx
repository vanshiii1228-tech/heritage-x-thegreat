import { useEffect, useState, type ReactNode } from "react";
import type { Destination, Question } from "@/lib/heritage-data";
import type { Player, Settings } from "@/lib/game-types";

export function Modal({
  open,
  onClose,
  title,
  children,
  wide,
}: {
  open: boolean;
  onClose?: () => void;
  title?: string;
  children: ReactNode;
  wide?: boolean;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto bg-[oklch(0.12_0.03_35/85%)] p-3 backdrop-blur-sm">
      <div
        className={`hx-panel my-auto w-full ${wide ? "max-w-3xl" : "max-w-lg"} animate-[fade-in_0.25s_ease-out] p-5 sm:p-7`}
      >
        {title && (
          <h2 className="hx-title mb-4 text-center text-2xl sm:text-3xl">{title}</h2>
        )}
        {children}
        {onClose && (
          <div className="mt-6 text-center">
            <button className="hx-btn text-sm" onClick={onClose}>
              CLOSE
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Toggle({
  label,
  value,
  onChange,
}: {
  label: string;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-border/60 py-3">
      <span className="text-sm font-medium text-parchment">{label}</span>
      <button
        onClick={() => onChange(!value)}
        aria-pressed={value}
        className={`relative h-7 w-14 shrink-0 rounded-full border border-gold-deep transition-colors ${
          value ? "bg-[image:var(--gradient-gold)]" : "bg-muted"
        }`}
      >
        <span
          className={`absolute top-0.5 h-5 w-5 rounded-full bg-parchment transition-all ${
            value ? "left-8" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}

export function SettingsPanel({
  open,
  onClose,
  settings,
  setSettings,
  onRestart,
}: {
  open: boolean;
  onClose: () => void;
  settings: Settings;
  setSettings: (s: Settings) => void;
  onRestart: () => void;
}) {
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
    else document.exitFullscreen?.();
  };
  return (
    <Modal open={open} onClose={onClose} title="Settings">
      <div className="space-y-1">
        <Toggle
          label="Sound Effects"
          value={settings.sound}
          onChange={(v) => setSettings({ ...settings, sound: v })}
        />
        <Toggle
          label="Background Music"
          value={settings.music}
          onChange={(v) => setSettings({ ...settings, music: v })}
        />
        <div className="flex items-center justify-between gap-4 border-b border-border/60 py-3">
          <span className="text-sm font-medium text-parchment">Music Volume</span>
          <input
            type="range"
            min={0}
            max={100}
            value={Math.round(settings.volume * 100)}
            onChange={(e) => setSettings({ ...settings, volume: Number(e.target.value) / 100 })}
            className="w-36 accent-[var(--gold)]"
          />
        </div>
        <Toggle
          label="Animations"
          value={settings.animations}
          onChange={(v) => setSettings({ ...settings, animations: v })}
        />
        <Toggle
          label="Video Sound"
          value={settings.videoSound}
          onChange={(v) => setSettings({ ...settings, videoSound: v })}
        />
        <div className="flex flex-wrap gap-3 pt-5">
          <button className="hx-btn flex-1 text-sm" onClick={toggleFullscreen}>
            FULLSCREEN
          </button>
          <button className="hx-btn flex-1 text-sm" onClick={onRestart}>
            RESTART GAME
          </button>
        </div>
      </div>
    </Modal>
  );
}

export function HowToPlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  return (
    <Modal open={open} onClose={onClose} title="How To Play" wide>
      <div className="space-y-4 text-sm leading-relaxed text-parchment/90">
        <section>
          <h3 className="text-gold">Objective</h3>
          <p>
            Travel through India's heritage journey along the spiral board and be the first to
            reach the centre of the spiral.
          </p>
        </section>
        <section>
          <h3 className="text-gold">Gameplay</h3>
          <ul className="list-disc space-y-1 pl-5">
            <li>Each player picks a historical character.</li>
            <li>Players take turns rolling their own dice.</li>
            <li>The number rolled decides how many spaces the character moves.</li>
            <li>Most spaces are normal movement spaces.</li>
            <li>Selected spaces are special heritage destinations.</li>
            <li>Landing on a destination plays a video about that place.</li>
            <li>You must watch the video for 30 seconds.</li>
            <li>Then answer a question about that heritage place.</li>
            <li>Correct answer: +100 Heritage Points.</li>
            <li>Wrong answer: move 2 spaces backwards.</li>
            <li>The first player to reach the centre wins the journey.</li>
          </ul>
        </section>
      </div>
    </Modal>
  );
}

export function VideoModal({
  destination,
  videoSound,
  onContinue,
}: {
  destination: Destination;
  videoSound: boolean;
  onContinue: () => void;
}) {
  const [left, setLeft] = useState(30);
  useEffect(() => {
    setLeft(30);
    const t = setInterval(() => setLeft((v) => (v <= 1 ? 0 : v - 1)), 1000);
    return () => clearInterval(t);
  }, [destination.id]);

  return (
    <Modal open title={destination.name} wide>
      <div className="hx-frame overflow-hidden rounded-2xl bg-black">
        <div className="relative w-full" style={{ aspectRatio: "9 / 16", maxHeight: "52vh" }}>
          <iframe
            key={destination.id}
            className="absolute inset-0 h-full w-full"
            src={`https://www.youtube.com/embed/${destination.videoId}?autoplay=1&playsinline=1&rel=0&mute=${videoSound ? 0 : 1}`}
            title={`${destination.name} heritage video`}
            allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
      <p className="mt-4 text-center text-sm text-muted-foreground">
        {left > 0
          ? `Watch the heritage video — ${left}s remaining`
          : "Video experience complete!"}
      </p>
      <div className="mt-4 text-center">
        <button className="hx-btn hx-btn-gold w-full sm:w-auto" disabled={left > 0} onClick={onContinue}>
          CONTINUE TO QUESTION
        </button>
      </div>
    </Modal>
  );
}

export function QuestionModal({
  destination,
  question,
  onAnswer,
}: {
  destination: Destination;
  question: Question;
  onAnswer: (correct: boolean) => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);

  const choose = (i: number) => {
    if (picked !== null) return;
    setPicked(i);
    setTimeout(() => onAnswer(i === question.answer), 1600);
  };

  return (
    <Modal open title={`${destination.icon} ${destination.name}`}>
      <p className="mb-5 text-center text-base font-semibold text-parchment">{question.q}</p>
      <div className="grid gap-3">
        {question.options.map((opt, i) => {
          const state =
            picked === null
              ? ""
              : i === question.answer
                ? "!bg-[oklch(0.55_0.15_150)] !text-parchment"
                : i === picked
                  ? "!bg-destructive !text-destructive-foreground"
                  : "opacity-50";
          return (
            <button
              key={opt}
              className={`hx-btn justify-start text-left text-sm normal-case ${state}`}
              onClick={() => choose(i)}
            >
              <span className="mr-2 font-bold text-gold">{String.fromCharCode(65 + i)}.</span>
              {opt}
            </button>
          );
        })}
      </div>
      {picked !== null && (
        <p className="mt-5 text-center font-display text-lg">
          {picked === question.answer ? (
            <span className="text-gold">Correct! +100 Heritage Points</span>
          ) : (
            <span className="text-destructive">Incorrect — move 2 spaces back</span>
          )}
        </p>
      )}
    </Modal>
  );
}

export function WinnerModal({
  winner,
  players,
  onPlayAgain,
  onMainMenu,
}: {
  winner: Player;
  players: Player[];
  onPlayAgain: () => void;
  onMainMenu: () => void;
}) {
  const ranked = [...players].sort((a, b) => b.points - a.points);
  return (
    <>
      <div className="pointer-events-none fixed inset-0 z-[60] overflow-hidden">
        {Array.from({ length: 60 }).map((_, i) => (
          <span
            key={i}
            className="absolute block h-3 w-2 rounded-sm"
            style={{
              left: `${(i * 37) % 100}%`,
              background: ["var(--gold)", "var(--saffron)", "var(--teal)", "var(--p2)"][i % 4],
              animation: `confetti-fall ${2 + (i % 5) * 0.6}s linear ${(i % 10) * 0.25}s infinite`,
            }}
          />
        ))}
      </div>
      <Modal open title="🎉 Heritage Journey Complete! 🎉">
        <div className="text-center">
          <img
            src={winner.character.image}
            alt={winner.character.name}
            width={512}
            height={512}
            className="mx-auto h-40 w-auto drop-shadow-[0_10px_20px_oklch(0_0_0/70%)]"
          />
          <p className="mt-2 font-display text-xl text-gold">{winner.character.name}</p>
          <p className="text-sm text-muted-foreground">has reached the centre of the spiral!</p>
          <p className="mt-2 font-display text-2xl text-parchment">
            {winner.points} Heritage Points
          </p>
        </div>
        <div className="mt-6 space-y-2">
          <h3 className="text-center text-sm uppercase tracking-widest text-gold">
            Final Scoreboard
          </h3>
          {ranked.map((p, i) => (
            <div
              key={p.id}
              className="flex items-center justify-between rounded-xl border border-border bg-card/60 px-3 py-2 text-sm"
            >
              <span className="flex items-center gap-2">
                <span className="text-gold">#{i + 1}</span>
                <img src={p.character.image} alt="" className="h-7 w-auto" />
                {p.character.name}
              </span>
              <span className="font-semibold">{p.points} pts</span>
            </div>
          ))}
        </div>
        <div className="mt-6 flex flex-wrap gap-3">
          <button className="hx-btn hx-btn-gold flex-1" onClick={onPlayAgain}>
            PLAY AGAIN
          </button>
          <button className="hx-btn flex-1" onClick={onMainMenu}>
            MAIN MENU
          </button>
        </div>
      </Modal>
    </>
  );
}
