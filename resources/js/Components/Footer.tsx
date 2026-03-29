export default function Footer(props: { className?: string }) {
  return (
    <div className="mx-auto max-h-40 w-full bg-white p-3 pt-4 shadow-[0_-5px_5px_-2px_rgba(0,0,0,0.1)] sm:px-6 lg:px-8">
      <footer
        className={`mx-auto max-w-7xl text-sm text-gray-500 ${props.className || ""}`}
      >
        <p>© {new Date().getFullYear()} Bank Website. All rights reserved.</p>
      </footer>
    </div>
  );
}
