import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import {
  DESTINATIONS,
  DESTINATION_TILES,
  TILE_COUNT,
  type Character,
  type Destination,
  type Question,
} from "@/lib/heritage-data";
import { DEFAULT_SETTINGS, type Player, type Settings } from "@/lib/game-types";
import { Board } from "@/components/game/Board";
import { PlayerDice } from "@/components/game/PlayerDice";
import { CharacterSelect, MenuScreen, PlayerCountModal } from "@/components/game/MenuScreen";
import {
  HowToPlay,
  QuestionModal,
  SettingsPanel,
  VideoModal,
  WinnerModal,
} from "@/components/game/Modals";
import musicAsset from "@/assets/background-music.mp3.asset.json";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "HeritageX — Indian Heritage Board Game" },
      {
        name: "description",
        content:
          "Play HeritageX, a multiplayer spiral board game journeying through India's heritage sites with videos, quizzes and Heritage Points.",
      },
      { property: "og:title", content: "HeritageX — Indian Heritage Board Game" },
      {
        property: "og:description",
        content:
          "Roll the dice, travel the spiral, watch heritage videos and answer questions to win the journey through India's history.",
      },
    ],
  }),
  component: HeritageX,
});

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

function HeritageX() {
  const [screen, setScreen] = useState<"menu" | "select" | "game">("menu");
  const [settings, setSettings] = useState<Settings>(DEFAULT_SETTINGS);
  const [showCount, setShowCount] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showHow, setShowHow] = useState(false);

  const [playerCount, setPlayerCount] = useState<number | null>(null);
  const [picks, setPicks] = useState<Character[]>([]);

  const [players, setPlayers] = useState<Player[]>([]);
  const [turn, setTurn] = useState(0);
  const [dice, setDice] = useState<number[]>([1, 1, 1, 1]);
  const [rolling, setRolling] = useState(false);
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);

  const [video, setVideo] = useState<Destination | null>(null);
  const [question, setQuestion] = useState<{ dest: Destination; q: Question } | null>(null);
  const [winner, setWinner] = useState<Player | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const playersRef = useRef<Player[]>([]);
  useEffect(() => {
    playersRef.current = players;
  }, [players]);

  /* ---------------- audio ---------------- */
  useEffect(() => {
    const a = audioRef.current;
    if (!a) return;
    a.volume = settings.volume;
    const wantsMusic = settings.music && !video;
    if (wantsMusic) {
      a.play().catch(() => {});
    } else {
      a.pause();
    }
  }, [settings.music, settings.volume, video]);

  useEffect(() => {
    const kick = () => {
      if (settings.music && !video) audioRef.current?.play().catch(() => {});
    };
    window.addEventListener("pointerdown", kick, { once: true });
    window.addEventListener("keydown", kick, { once: true });
    return () => {
      window.removeEventListener("pointerdown", kick);
      window.removeEventListener("keydown", kick);
    };
  }, [settings.music, video]);

  const beep = useCallback(
    (freq: number) => {
      if (!settings.sound) return;
      try {
        const Ctx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        const ctx = new Ctx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.frequency.value = freq;
        osc.type = "triangle";
        gain.gain.setValueAtTime(0.08, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.connect(gain).connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
        setTimeout(() => ctx.close(), 400);
      } catch {
        /* ignore */
      }
    },
    [settings.sound],
  );

  const stepDelay = settings.animations ? 260 : 40;

  /* ---------------- setup ---------------- */
  const startGame = () => {
    setPlayers(
      picks.map((c, i) => ({ id: `p${i + 1}`, character: c, pos: 0, points: 0 })),
    );
    setTurn(0);
    setDice([1, 1, 1, 1]);
    setWinner(null);
    busyRef.current = false;
    setBusy(false);
    setScreen("game");
  };

  const backToMenu = () => {
    setScreen("menu");
    setPicks([]);
    setPlayerCount(null);
    setPlayers([]);
    setWinner(null);
    setVideo(null);
    setQuestion(null);
    busyRef.current = false;
    setBusy(false);
  };

  const playAgain = () => {
    setPlayers((ps) => ps.map((p) => ({ ...p, pos: 0, points: 0 })));
    setTurn(0);
    setWinner(null);
    setVideo(null);
    setQuestion(null);
    busyRef.current = false;
    setBusy(false);
  };

  /* ---------------- turn engine ---------------- */
  const endTurn = useCallback(() => {
    setTurn((t) => (t + 1) % Math.max(1, players.length));
    busyRef.current = false;
    setBusy(false);
  }, [players.length]);

  const movePlayer = useCallback(
    async (index: number, steps: number, dir: 1 | -1) => {
      for (let s = 0; s < steps; s++) {
        let reachedEnd = false;
        setPlayers((ps) =>
          ps.map((p, i) => {
            if (i !== index) return p;
            const next = Math.min(TILE_COUNT - 1, Math.max(0, p.pos + dir));
            if (next === TILE_COUNT - 1) reachedEnd = true;
            return { ...p, pos: next };
          }),
        );
        beep(dir === 1 ? 620 : 320);
        await sleep(stepDelay);
        if (reachedEnd) break;
      }
    },
    [beep, stepDelay],
  );

  const rollDice = useCallback(
    async (index: number) => {
      if (busyRef.current || winner) return;
      if (index !== turn) return;
      busyRef.current = true;
      setBusy(true);
      setRolling(true);
      beep(880);

      const spin = setInterval(() => {
        setDice((d) => d.map((v, i) => (i === index ? 1 + Math.floor(Math.random() * 6) : v)));
      }, 80);
      await sleep(750);
      clearInterval(spin);

      const value = 1 + Math.floor(Math.random() * 6);
      setDice((d) => d.map((v, i) => (i === index ? value : v)));
      setRolling(false);
      await sleep(250);

      await movePlayer(index, value, 1);

      // resolve landing
      const landed = playersRef.current[index]?.pos ?? 0;

      if (landed >= TILE_COUNT - 1) {
        const w = playersRef.current[index];
        if (w) setWinner(w);
        beep(1200);
        return;
      }

      const destId = DESTINATION_TILES[landed];
      const dest = destId ? DESTINATIONS[destId] : undefined;
      if (dest) {
        setVideo(dest);
      } else {
        endTurn();
      }
    },
    [beep, endTurn, movePlayer, turn, winner],
  );

  const onVideoContinue = () => {
    const dest = video;
    if (!dest) return;
    setVideo(null);
    const q = dest.questions[Math.floor(Math.random() * dest.questions.length)]!;
    setQuestion({ dest, q });
  };

  const onAnswer = async (correct: boolean) => {
    const index = turn;
    setQuestion(null);
    if (correct) {
      setPlayers((ps) =>
        ps.map((p, i) => (i === index ? { ...p, points: p.points + 100 } : p)),
      );
      setToast("+100 Heritage Points!");
      beep(1046);
      setTimeout(() => setToast(null), 1700);
      await sleep(900);
    } else {
      setToast("Incorrect Answer");
      beep(220);
      setTimeout(() => setToast(null), 1700);
      await sleep(700);
      await movePlayer(index, 2, -1);
    }
    endTurn();
  };

  /* ---------------- character selection ---------------- */
  const pickCharacter = (c: Character) => {
    if (picks.some((p) => p.id === c.id)) return;
    setPicks((prev) => (prev.length < (playerCount ?? 0) ? [...prev, c] : prev));
    beep(700);
  };

  const activePlayer = players[turn];

  /* ---------------- render ---------------- */
  const overlays = (
    <>
      <PlayerCountModal
        open={showCount}
        value={playerCount}
        onSelect={(n) => {
          setPlayerCount(n);
          setPicks([]);
          setShowCount(false);
          setScreen("select");
        }}
        onClose={() => setShowCount(false)}
      />
      <SettingsPanel
        open={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        setSettings={setSettings}
        onRestart={() => {
          setShowSettings(false);
          backToMenu();
        }}
      />
      <HowToPlay open={showHow} onClose={() => setShowHow(false)} />
      {video && (
        <VideoModal
          destination={video}
          videoSound={settings.videoSound}
          onContinue={onVideoContinue}
        />
      )}
      {question && (
        <QuestionModal destination={question.dest} question={question.q} onAnswer={onAnswer} />
      )}
      {winner && (
        <WinnerModal
          winner={winner}
          players={players}
          onPlayAgain={playAgain}
          onMainMenu={backToMenu}
        />
      )}
      <audio ref={audioRef} src={musicAsset.url} loop preload="auto" />
    </>
  );

  if (screen === "menu") {
    return (
      <div className={settings.animations ? "" : "no-anim"}>
        <MenuScreen
          onPlayers={() => setShowCount(true)}
          onSettings={() => setShowSettings(true)}
          onHowTo={() => setShowHow(true)}
        />
        {overlays}
      </div>
    );
  }

  if (screen === "select") {
    return (
      <div className={settings.animations ? "" : "no-anim"}>
        <CharacterSelect
          playerIndex={picks.length}
          playerCount={playerCount ?? 2}
          taken={picks.map((p) => p.id)}
          picked={picks}
          onPick={pickCharacter}
          onStart={startGame}
          onBack={backToMenu}
        />
        {overlays}
      </div>
    );
  }

  return (
    <div className={`min-h-screen px-3 py-4 sm:px-6 ${settings.animations ? "" : "no-anim"}`}>
      <header className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
        <div className="min-w-0">
          <h1 className="hx-title truncate text-xl sm:text-3xl">HERITAGEX</h1>
          <p className="truncate text-xs text-gold sm:text-sm">
            {activePlayer ? `${activePlayer.character.name}'s Turn` : ""}
          </p>
        </div>
        <div className="flex shrink-0 gap-2">
          <button className="hx-btn px-3 py-2 text-xs" onClick={() => setShowHow(true)}>
            RULES
          </button>
          <button className="hx-btn px-3 py-2 text-xs" onClick={() => setShowSettings(true)}>
            SETTINGS
          </button>
        </div>
      </header>

      <div className="mx-auto mt-4 grid max-w-6xl gap-4 lg:grid-cols-[260px_minmax(0,1fr)_260px]">
        {/* left dice column (players 1 & 3) */}
        <div className="order-2 flex flex-col gap-3 lg:order-1 lg:justify-center">
          {players
            .filter((_, i) => i % 2 === 0)
            .map((p) => {
              const i = players.indexOf(p);
              return (
                <PlayerDice
                  key={p.id}
                  player={p}
                  active={i === turn && !winner}
                  value={dice[i] ?? 1}
                  rolling={rolling && i === turn}
                  disabled={i !== turn || busy || !!winner}
                  onRoll={() => rollDice(i)}
                />
              );
            })}
        </div>

        {/* board */}
        <div className="order-1 mx-auto w-full max-w-[min(92vw,620px)] lg:order-2">
          <Board players={players} activeId={activePlayer?.id ?? ""} />
        </div>

        {/* right dice column (players 2 & 4) */}
        <div className="order-3 flex flex-col gap-3 lg:justify-center">
          {players
            .filter((_, i) => i % 2 === 1)
            .map((p) => {
              const i = players.indexOf(p);
              return (
                <PlayerDice
                  key={p.id}
                  player={p}
                  active={i === turn && !winner}
                  value={dice[i] ?? 1}
                  rolling={rolling && i === turn}
                  disabled={i !== turn || busy || !!winner}
                  onRoll={() => rollDice(i)}
                />
              );
            })}
        </div>
      </div>

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 top-1/3 z-40 text-center">
          <span className="animate-float-up inline-block rounded-2xl border border-gold-deep bg-card px-6 py-3 font-display text-xl text-gold shadow-[var(--shadow-gold)]">
            {toast}
          </span>
        </div>
      )}

      {overlays}
    </div>
  );
}
