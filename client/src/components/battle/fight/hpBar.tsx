interface HpBarProps {
  name: string;
  hp: number;
  hp_base: number;
}

const HpBar = ({ name, hp, hp_base }: HpBarProps) => {
  const colorHp = () => {
    if (hp <= hp_base / 2 && hp > hp_base / 4) {
      return "oklch(var(--wa))";
    }
    if (hp <= hp_base / 4) {
      return "oklch(var(--er))";
    }
    return "oklch(var(--su))";
  };
  return (
    <div className="w-3/4 mb-4 text-white">
      <div className="flex items-center justify-between">
        <h2 className="capitalize">{name}</h2>
        <h2>
          {hp}/{hp_base}
        </h2>
      </div>
      <progress
        className="progress ring"
        style={{ color: colorHp() }}
        value={hp}
        max={hp_base}
      ></progress>
    </div>
  );
};

export default HpBar;
