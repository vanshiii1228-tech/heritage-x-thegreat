type Props = {
  value: number;
  rolling: boolean;
  size?: number;
};

const PIPS: number[][] = [
  [4],
  [0, 8],
  [0, 4, 8],
  [0, 2, 6, 8],
  [0, 2, 4, 6, 8],
  [0, 2, 3, 5, 6, 8],
];

export function DiceFace({ value, rolling, size = 64 }: Props) {
  const pips = PIPS[Math.min(5, Math.max(0, value - 1))];
  return (
    <div
      className="dice-face grid grid-cols-3 grid-rows-3 gap-[2px] p-[10%]"
      style={{
        width: size,
        height: size,
        animation: rolling ? "dice-tumble 0.45s linear infinite" : undefined,
      }}
      aria-label={`Dice showing ${value}`}
    >
      {Array.from({ length: 9 }).map((_, i) => (
        <span
          key={i}
          className={pips.includes(i) ? "dice-pip" : "opacity-0"}
          aria-hidden
        />
      ))}
    </div>
  );
}
