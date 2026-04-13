interface PasswordStrengthProps {
  password: string;
}

export default function PasswordStrength({ password }: PasswordStrengthProps) {
  const length = password.length;
  const strength: number =
    length === 0 ? 0
    : length < 8  ? 1
    : length < 12 && !/[^a-zA-Z0-9]/.test(password) ? 2
    : length >= 12 && /[^a-zA-Z0-9]/.test(password) ? 4
    : 3;

  const labels: string[] = ["", "Weak", "Fair", "Good", "Strong"];
  const colors: string[] = ["", "bg-red-400", "bg-amber-400", "bg-lime-500", "bg-green-500"];
  const textColors: string[] = ["", "text-red-500", "text-amber-500", "text-lime-600", "text-green-600"];

  if (strength === 0) return null;

  return (
    <div className="flex items-center gap-2 mt-1">
      <div className="flex gap-1 flex-1">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors duration-300 ${
              i <= strength ? colors[strength] : "bg-stone-200"
            }`}
          />
        ))}
      </div>
      <span className={`text-xs font-medium ${textColors[strength]}`}>
        {labels[strength]}
      </span>
    </div>
  );
}
