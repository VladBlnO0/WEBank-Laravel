import Mastercard from "@/../../public/assets/icons/mastercard-svgrepo-com.svg";
import Visa from "@/../../public/assets/icons/visa-3-svgrepo-com.svg";
import { CardData } from "@/types";
const iconMap: Record<string, string> = {
  mastercard: Mastercard,
  visa: Visa,
};
export default function PaymentNetwork({
  card,
  className = "",
}: {
  card: CardData;
  className?: string;
}) {
  return (
    <img
      src={iconMap[card.payment_network]}
      alt={card.payment_network}
      className={className}
    />
  );
}
