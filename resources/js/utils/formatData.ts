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

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "2-digit",
    month: "2-digit",

  });
}
export { formatCardNumber, formatDate, formatToLocal };
