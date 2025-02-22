export interface ContractConfig<T = unknown> {
  depositContract: {
    address: string;
    abi: T[];
  };
  smToken: {
    address: string;
    abi: T[];
  };
}

export interface DepositInfo {
  amount: bigint;
  timestamp: bigint;
  lastInterestCalculation: bigint;
}

export interface Token {
  address: `0x${string}`;
  symbol: string;
  decimals: number;
}
