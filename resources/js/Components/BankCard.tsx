import Mastercard from "@/../../public/assets/icons/mastercard-svgrepo-com.svg";
import Visa from "@/../../public/assets/icons/visa-3-svgrepo-com.svg";
import { CardData } from "@/types";
import { formatDate, formatToLocal } from "@/utils/formatData";
import { useState } from "react";

export default function BankCard({
  card,
  className = "",
  onClick,
}: {
  card: CardData;
  className?: string;
  onClick?: () => void;
}) {
  const [showDigits, setShowDigits] = useState(false);
  const [isFlipped, setIsFlipped] = useState(false);

  const safeNumber = card.number
    .replace(/\s+/g, "")
    .padEnd(16, "•")
    .slice(0, 16);
  const digitsGroups = safeNumber.match(/.{1,4}/g) || [
    "••••",
    "••••",
    "••••",
    "••••",
  ];
  const masked = `${digitsGroups[0]}${"•".repeat(8)}${digitsGroups[3]}`;
  const cardGroups = masked.match(/.{1,4}/g) || [
    "••••",
    "••••",
    "••••",
    "••••",
  ];

  const displayGroups = showDigits ? digitsGroups : cardGroups;

  function toggle() {
    setShowDigits((prev) => !prev);
  }

  function copyToClipboard() {
    navigator.clipboard.writeText(card.number);
  }

  const handleClick = () => {
    setIsFlipped((prev) => !prev);
  };

  const iconMap: Record<string, string> = {
    mastercard: Mastercard,
    visa: Visa,
  };

  return (
    <div
      role={onClick ? "button" : undefined}
      onClick={onClick || handleClick}
      tabIndex={onClick ? 0 : -1}
      aria-label={`Card ending ${cardGroups[3]}`}
      className={
        `relative h-62.5 w-112.5 transform text-white transition-transform duration-300 will-change-transform perspective-normal hover:scale-[1.01] ` +
        className
      }
    >
      <div
        className={`relative h-full w-full transition-transform duration-600 transform-3d ${
          isFlipped ? "transform-[rotateY(180deg)]" : ""
        }`}
      >
        <div className="absolute inset-0 z-10 flex h-full flex-col justify-between overflow-hidden rounded-2xl border border-white/20 bg-linear-to-br from-slate-950 via-slate-800 to-slate-600 p-6 shadow-2xl backface-hidden">
          <div className="pointer-events-none absolute -top-20 -right-20 h-52 w-52 rounded-full bg-emerald-300/20 blur-3xl" />
          <div className="pointer-events-none absolute -bottom-24 -left-20 h-56 w-56 rounded-full bg-cyan-300/15 blur-3xl" />

          <div className="relative flex w-full select-none">
            <div className="flex items-center gap-3 font-bold">
              <i className="bi bi-credit-card-fill text-[2.5rem]" aria-hidden />
              <p className="tracking-wide select-none">
                {card.type?.toUpperCase() || "BANK CARD"}
              </p>
            </div>
            <img
              src={iconMap[card.payment_network]}
              alt={card.payment_network}
              className="ml-auto size-10 shrink-0 object-contain"
            />
          </div>

          <div
            className="mt-2 cursor-copy tracking-widest"
            role="button"
            tabIndex={0}
            onClick={(e) => {
              copyToClipboard();
              e.stopPropagation();
            }}
            onMouseLeave={() => setShowDigits(false)}
            aria-pressed={showDigits}
            aria-label={showDigits ? "Hide card number" : "Show card number"}
          >
            <div className="mb-1.5 flex justify-center gap-4 text-3xl font-bold sm:text-4xl">
              <span className="inline-block text-center font-mono">
                {displayGroups[0]}
              </span>
              {Array.from({ length: 2 }, (_, i) => (
                <span
                  key={i + 1}
                  className="inline-block text-center font-mono"
                  onClick={() => toggle()}
                >
                  {displayGroups[i + 1] ?? "••••"}
                </span>
              ))}
              <span className="inline-block text-center font-mono">
                {displayGroups[3]}
              </span>
            </div>
          </div>

          <div
            className="relative flex items-center justify-between"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex flex-row items-center gap-1 text-lg">
              <p className="text-gray-300 select-none">Balance:</p>
              <p className="font-bold">{formatToLocal(card.balance)}</p>
            </div>
            <div className="flex flex-row">
              <p className="font-medium text-gray-300 select-none">Exp:</p>
              <span className="ml-1 font-bold select-all">
                {formatDate(card.expire_date ? card.expire_date : 0)}
              </span>
            </div>
          </div>
        </div>

        <div className="absolute inset-0 flex transform-[rotateY(180deg)] items-center justify-center rounded-2xl shadow-lg backface-hidden">
          <div className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-white/10 bg-linear-to-br from-slate-800 to-slate-950 shadow-lg backface-hidden">
            <div className="mt-10 h-10.5 w-full bg-black" />

            <div className="mx-6 mb-20 flex items-center justify-between rounded-sm bg-white/90 p-2 shadow-inner">
              <div className="h-8 w-full bg-white/70" />
              <div className="ml-2 flex items-center">
                <p className="mr-2 text-slate-600 select-none">CVV</p>
                <div
                  className="h-full w-14 rounded-sm bg-slate-900/80 px-2 py-1 text-center text-sm font-semibold tracking-widest text-white"
                  onClick={(e) => {
                    e.stopPropagation();
                  }}
                >
                  {card.cvv ?? "•••"}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
