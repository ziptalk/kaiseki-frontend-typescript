export const wei = (num: number, decimals = 18): bigint => {
  return BigInt(num) * BigInt(10) ** BigInt(decimals);
};

export const ether = (weiValue: bigint, decimals = 18): number => {
  const factor = BigInt(10) ** BigInt(decimals);
  const etherValue = Number(weiValue) / Number(factor);
  return etherValue;
};
