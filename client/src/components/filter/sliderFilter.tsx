interface Slider {
  className?: string;
  name: string;
  type: keyof typeof Type;
}

enum Type {
  primary = "range-primary",
  secondary = "range-secondary",
  accent = "range-accent",
  success = "range-success",
  info = "range-info",

  error = "range-error",

  warning = "range-warning",
}

const SliderFilter = ({ name, type, className }: Slider) => {
  return (
    <div className={className}>
      <h4 className="text-sm my-2">{name}</h4>
      <input type="range" min={0} max="100" className={`range ${Type[type]}`} />
    </div>
  );
};

export default SliderFilter;
