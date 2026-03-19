import { CardData } from '@/types';
import { useState } from 'react';

export default function BankCard({
  card,
  className = '',
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

  const digits = card.number.replace(/\D/g, '');
  const digitsGroups = digits.match(/.{1,4}/g) || [];
  const masked = digits.slice(0, -4).replace(/./g, '•') + digits.slice(-4);
  const cardGroups = masked.match(/.{1,4}/g) || [];

  const date = new Date(card.expire_date || '');
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: '2-digit',
    month: '2-digit',
  });
  const formatted = formatter.format(date);

  const displayGroups = showDigits ? digitsGroups : cardGroups;
  function toggle() {
    navigator.clipboard.writeText(card.number);
  }
  const handleClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick || handleClick}
      tabIndex={onClick ? 0 : -1}
      aria-label={`Card ${cardGroups[0]} ending ${cardGroups[3]}`}
      className={
        `relative h-62.5 w-112.5 transform text-white transition-transform duration-500 will-change-transform perspective-[1000px] hover:scale-105 hover:delay-200 ` +
        className
      }
    >
      <div
        className={`relative h-full w-full transition-transform duration-700 transform-3d ${
          isFlipped ? 'transform-[rotateY(180deg)]' : ''
        }`}
      >
        {/* Front of the card */}
        <div className="absolute inset-0 z-10 flex h-full flex-col justify-between overflow-hidden rounded-lg bg-linear-to-r from-slate-900 to-slate-600 p-6 shadow-2xl backface-hidden">
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3 font-bold">
              <i className="bi bi-credit-card-fill text-[2.5rem]" aria-hidden />
              <span className="text-lg font-medium text-gray-200">
                {card.type?.toLocaleUpperCase()}
              </span>
            </div>
          </div>

          <div
            className="mt-2 text-center tracking-widest"
            role="button"
            tabIndex={0}
            onClick={(e) => {
              toggle();
              e.stopPropagation();
            }}
            onMouseEnter={() => setShowDigits(true)}
            onMouseLeave={() => setShowDigits(false)}
            aria-pressed={showDigits}
            aria-label={showDigits ? 'Hide card number' : 'Show card number'}
          >
            <div className="mb-1.5 flex justify-center gap-4 text-xl text-[2.1rem] font-bold">
              {[0, 1, 2].map((i) => (
                <span
                  key={i}
                  className="relative inline-block w-[6ch] text-center font-mono"
                >
                  <span
                    className={`block transition-opacity duration-100 ${showDigits ? 'opacity-0' : 'opacity-100'}`}
                  >
                    {cardGroups[i] ?? '••••'}
                  </span>
                  <span
                    className={`absolute inset-0 transition-opacity duration-100 ${showDigits ? 'opacity-100' : 'opacity-0'}`}
                  >
                    {digitsGroups[i] ?? '••••'}
                  </span>
                </span>
              ))}
              <span className="relative inline-block w-[6ch] text-center font-mono">
                {displayGroups[3]}
              </span>
            </div>
          </div>

          <div
            className="mt-2 flex font-medium text-gray-300"
            onClick={(e) => {
              e.stopPropagation();
            }}
          >
            <p>Exp: </p>
            <p> {formatted ?? '/'}</p>
          </div>
        </div>
        <div className="absolute inset-0 flex transform-[rotateY(180deg)] items-center justify-center rounded-lg bg-red-500 shadow-lg backface-hidden">
          <div className="absolute inset-0 flex flex-col justify-between rounded-lg bg-linear-to-br from-slate-800 to-slate-900 shadow-lg backface-hidden">
            <div className="mt-6 h-10.5 w-full bg-black/90" />

            <div className="mx-6 mb-8 flex items-center justify-between rounded-sm bg-white/90 p-2 shadow-inner">
              <div className="h-8 w-2/3 bg-white/70" />

              <div className="flex flex-col items-end gap-1">
                <div className="text-[10px] text-slate-600 uppercase">CVV</div>
                <div className="w-14 rounded-sm bg-slate-900/80 px-2 py-1 text-center text-sm font-semibold tracking-widest text-white">
                  {card.cvv ?? '•••'}
                </div>
              </div>
            </div>

            <div className="left-0 mx-6 mb-4 flex justify-end text-slate-200/70">
              <span className="bi bi-gear-fill text-xl opacity-70"></span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
