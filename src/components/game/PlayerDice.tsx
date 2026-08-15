import { DiceFace } from "./Dice";
import type { Player } from "@/lib/game-types";

export function PlayerDice({
  player,
  active,
  value,
  rolling,
  disabled,
  onRoll,
}: {
  player: Player;
  active: boolean;
  value: number;
  rolling: boolean;
  disabled: boolean;
  onRoll: () => void;
}) {
  return (
    <div
      className={`hx-frame flex w-full items-center gap-3 rounded-2xl bg-[image:var(--gradient-royal)] p-2.5 transition-all sm:p-3 ${
        active ? "ring-2 ring-[var(--gold)]" : "opacity-60"
      }`}
    >
      <img
        src={player.character.image}
        alt={player.character.name}
        width={512}
        height={512}
        loading="lazy"
        className={`h-11 w-auto shrink-0 sm:h-14 ${active ? "drop-shadow-[0_0_10px_var(--gold)]" : ""}`}
      />
      <div className="min-w-0 flex-1">
        <p className="truncate text-xs font-semibold text-parchment sm:text-sm">
          {player.character.short}
        </p>
        <p className="text-[11px] text-gold sm:text-xs">{player.points} pts</p>
      </div>
      <button
        onClick={onRoll}
        disabled={disabled}
        aria-label={`Roll dice for ${player.character.name}`}
        className={`shrink-0 rounded-xl transition-transform ${
          active && !disabled ? "animate-glow-pulse hover:scale-110 active:scale-95" : "opacity-50"
        }`}
      >
        <DiceFace value={value} rolling={rolling} size={44} />
      </button>
    </div>
  );
}
