export interface ContractConfig {
  depositContract: {
    address: string;
    abi: any[];
  };
  smToken: {
    address: string;
    abi: any[];
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
