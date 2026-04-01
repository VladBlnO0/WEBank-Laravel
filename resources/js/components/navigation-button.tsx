export default function Button({
  children,
  onClick,
  disabled = false,
  className = "",
  type = "button",
}: {
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
  type?: "button" | "submit" | "reset";
}) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={
        `rounded-lg px-4 py-2 font-semibold text-black transition hover:text-gray-700 disabled:opacity-50 ` +
        className
      }
    >
      {children}
    </button>
  );
}
