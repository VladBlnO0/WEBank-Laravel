function formatToLocal(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, "")
    .replace(/(.{4})/g, "$1 ")
    .trim();
}

function formatDate(value: number) {
  const date = new Date(value);
  const formatter = new Intl.DateTimeFormat("en-US", {
    year: "2-digit",
    month: "2-digit",
  });
  return formatter.format(date);
}
export { formatCardNumber, formatToLocal, formatDate };
