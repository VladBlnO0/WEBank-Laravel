import clsx from "clsx";

const date = new Date().getFullYear();

export default function Footer({
  className = "",
}: { className?: string } = {}) {
  return (
    <div className="mx-auto w-full border-t border-white/70 bg-white/65 px-3 py-4 shadow-[0_-8px_24px_-20px_rgba(15,23,42,0.5)] backdrop-blur-sm sm:px-6 lg:px-8">
      <footer
        className={clsx("mx-auto max-w-7xl text-sm text-slate-600", className)}
      >
        <p>© {date} Bank Website. All rights reserved.</p>
      </footer>
    </div>
  );
}
