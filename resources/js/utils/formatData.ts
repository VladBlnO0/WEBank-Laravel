function formatToLocal(value: any) {
  if (typeof value === 'number') {
    return value.toLocaleString('en-US', {
      style: 'currency',
      currency: 'USD',
    });
  }
  return String(value);
}

function formatCardNumber(value: string) {
  return value
    .replace(/\D/g, '')
    .replace(/(.{4})/g, '$1 ')
    .trim();
}
export { formatCardNumber, formatToLocal };
