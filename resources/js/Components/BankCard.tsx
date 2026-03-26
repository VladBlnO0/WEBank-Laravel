import Mastercard from "@/../../public/assets/icons/mastercard-svgrepo-com.svg";
import Visa from "@/../../public/assets/icons/visa-3-svgrepo-com.svg";
import { CardData } from "@/types";
import { formatToLocal } from "@/utils/formatData";
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

  // const digits = card.number.replace(/\s+/g, '').padEnd(16, '•');
  // const groups = digits.match(/.{1,4}/g) || [];
  // const cardNumber = groups.map((group) => group.slice().padStart(4, '•'));

  const digitsGroups = card.number.match(/.{0,4}/g) || [];
  const masked = digitsGroups[0] + "•".repeat(8) + digitsGroups[3];
  const cardGroups = masked.match(/.{1,4}/g) || [];

  const date = new Date(card.expire_date || "");
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "2-digit",
    month: "2-digit",
  });
  const formatted = formatter.format(date);

  const displayGroups = showDigits ? digitsGroups : cardGroups;
  function toggle() {
    showDigits ? setShowDigits(false) : setShowDigits(true);
    navigator.clipboard.writeText(card.number);
  }
  const handleClick = () => {
    setIsFlipped(!isFlipped);
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
        `relative h-62.5 w-112.5 transform text-white transition-transform duration-500 will-change-transform perspective-[1000px] ` +
        className
      }
    >
      <div
        className={`relative h-full w-full transition-transform duration-600 transform-3d ${
          isFlipped ? "transform-[rotateY(180deg)]" : ""
        }`}
      >
        {/* Front of the card */}
        <div className="absolute inset-0 z-10 flex h-full flex-col justify-between overflow-hidden rounded-lg bg-linear-to-r from-slate-900 to-slate-600 p-6 shadow-2xl backface-hidden">
          <div className="flex w-full select-none">
            <div className="flex items-center gap-3 font-bold">
              <i className="bi bi-credit-card-fill text-[2.5rem]" aria-hidden />
              <p className="select-none">{card.type?.toUpperCase()}</p>
            </div>
            <img
              src={iconMap[card.payment_network]}
              alt={card.payment_network}
              className="ml-auto size-10 shrink-0 object-contain"
            />
          </div>

          <div
            className="mt-2 tracking-widest"
            role="button"
            tabIndex={0}
            onClick={(e) => {
              toggle();
              e.stopPropagation();
            }}
            aria-pressed={showDigits}
            aria-label={showDigits ? "Hide card number" : "Show card number"}
          >
            <div className="mb-1.5 flex justify-center gap-4 text-4xl font-bold">
              <span className="inline-block text-center font-mono">
                {displayGroups[0]}
              </span>
              {Array.from({ length: 2 }, (_, i) => (
                <span
                  key={i + 1}
                  className="inline-block text-center font-mono"
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
            className="flex items-center justify-between"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <div className="flex flex-row items-center gap-1 text-lg">
              <p className="text-gray-300 select-none">Balance: </p>
              <p className="font-bold">{formatToLocal(card.balance)}</p>
            </div>
            <div className="flex flex-row">
              <p className="font-medium text-gray-300 select-none">Exp:</p>
              <span className="ml-1 font-bold select-all">{formatted}</span>
            </div>
          </div>
        </div>
        <div className="absolute inset-0 flex transform-[rotateY(180deg)] items-center justify-center rounded-lg shadow-lg backface-hidden">
          <div className="absolute inset-0 flex flex-col justify-between rounded-lg bg-linear-to-br from-slate-800 to-slate-900 shadow-lg backface-hidden">
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
