export default function BankCard({ cardNumber }: { cardNumber: string }) {
  return (
    <div className="position-relative flex h-62.5 w-112.5 flex-col overflow-hidden rounded-lg border-2 bg-gray-500 p-4 caret-amber-300 shadow-2xl transition duration-500 ease-in-out hover:scale-105 hover:shadow-amber-900">
      <div className="position-absolute h-20 w-20 translate-x-full -translate-y-[60%] rounded-full bg-amber-900"></div>
      <div className="circle2"></div>
      <div className="head">
        <div>
          <i className="fa-solid fa-credit-card fa-2xl"></i>
        </div>
        <div>Virtual Credit Card</div>
      </div>
      <div className="font-weight-{50} z-10 flex justify-center">
        <div>{cardNumber.slice(0, 4)}</div>
        <div>{cardNumber.slice(4, 8)}</div>
        <div>{cardNumber.slice(8, 12)}</div>
        <div>{cardNumber.slice(12, 16)}</div>
      </div>
      <div className="tail">
        <div>Vikas Maur</div>
        <div className="exp">
          Exp:
          <span className="text-sm font-bold text-amber-400">12/26</span>
        </div>
      </div>
    </div>
  );
}
