const FormatPrice = (price: number): string => {
  // Format the price into Rupiah currency
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(price);

  return formattedPrice;
};

export default FormatPrice;
