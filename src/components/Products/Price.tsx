// components/PriceDisplay.tsx
import React from 'react';
import { formatMoney } from '../../../utils/formatMoney';

interface PriceDisplayProps {
  amount: number;
  locale?: string;
  currency?: string;
}

const PriceDisplay: React.FC<PriceDisplayProps> = ({ amount, locale = 'en-PH', currency = 'PHP' }) => {
  return <div>{formatMoney(amount, locale, currency)}</div>;
};

export default PriceDisplay;
