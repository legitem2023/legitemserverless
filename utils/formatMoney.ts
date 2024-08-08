// utils/formatMoney.ts

export const formatMoney = (
    amount: number,
    locale: string = 'en-PH',
    currency: string = 'PHP'
  ): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };
  