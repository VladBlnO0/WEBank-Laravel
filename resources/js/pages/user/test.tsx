export default function Test({ cards, allTransactions }) {
  return (
    <div>
      <p>{JSON.stringify(cards)}</p>
      <p>{JSON.stringify(allTransactions)}</p>
    </div>
  );
}
