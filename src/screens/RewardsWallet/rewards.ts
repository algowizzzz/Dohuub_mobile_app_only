export function howToEarnPoints(referrerPoints: number, pointsPerCurrencyUnit: number): string[] {
  return [
    'Earn 1 point for every $1 spent on "Powered by DoHuub" services',
    `Get ${referrerPoints} bonus points when your referrals complete their first order`,
    `${pointsPerCurrencyUnit} points = $1 off your next order`,
  ];
}