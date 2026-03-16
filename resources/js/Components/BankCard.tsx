import { CardData } from '@/types';
import { useEffect, useState } from 'react';

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

  useEffect(() => {
    if (!showDigits) return;
    const t = setTimeout(() => setShowDigits(false), 5000);
    return () => clearTimeout(t);
  }, [showDigits]);

  const displayGroups = showDigits ? digitsGroups : cardGroups;
  const toggle = () => setShowDigits((s) => !s);
  return (
    <div
      role={onClick ? 'button' : undefined}
      onClick={onClick}
      tabIndex={onClick ? 0 : -1}
      aria-label={`Card ${cardGroups[0]} ending ${cardGroups[3]}`}
      className={
        `relative h-62.5 w-112.5 transform overflow-hidden rounded-lg bg-linear-to-r from-slate-900 to-slate-800 text-white shadow-2xl transition hover:scale-105 ` +
        className
      }
    >
      <div className="pointer-events-none absolute -top-10 -right-12 z-0 h-40 w-40 rounded-full bg-blue-800/80 blur-lg" />
      <div className="pointer-events-none absolute -bottom-12 -left-10 z-0 h-36 w-36 rounded-full bg-green-800/70 blur-lg" />

      <div className="relative z-10 flex h-full flex-col justify-between p-6">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 font-bold">
            <i className="bi bi-credit-card-fill text-[2.5rem]" aria-hidden />
            <div className="text-lg font-medium text-gray-200">
              {card.type?.toLocaleUpperCase()}
            </div>
          </div>
        </div>


        <div
          className="mt-2 text-center tracking-widest"
          role="button"
          tabIndex={0}
          onClick={toggle}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              toggle();
            }
          }}
          aria-pressed={showDigits}
          aria-label={showDigits ? 'Hide card number' : 'Show card number'}
        >
          <div className="mb-1.5 flex justify-center gap-4 text-xl text-[2.1rem] font-bold">
            <span>{displayGroups[0] ?? '••••'}</span>
            <span>{displayGroups[1] ?? '••••'}</span>
            <span>{displayGroups[2] ?? '••••'}</span>
            <span>{displayGroups[3] ?? '••••'}</span>
          </div>
        </div>

        <div className="text-wrapper flex text-xs text-[2.1rem] font-medium text-gray-300">
          <p>Exp: </p>
          <p> {formatted ?? '/'}</p>
        </div>
      </div>
    </div>
  );
}
