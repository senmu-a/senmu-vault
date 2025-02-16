import type { AddEthereumChainParameter } from "@web3-react/types";

const ETH: AddEthereumChainParameter["nativeCurrency"] = {
  name: "Ether",
  symbol: "ETH",
  decimals: 18,
};

interface BasicChainInformation {
  urls: string[];
  name: string;
}

interface ExtendedChainInformation extends BasicChainInformation {
  nativeCurrency: AddEthereumChainParameter["nativeCurrency"];
  blockExplorerUrls: AddEthereumChainParameter["blockExplorerUrls"];
}

function isExtendedChainInformation(
  chainInformation: BasicChainInformation | ExtendedChainInformation
): chainInformation is ExtendedChainInformation {
  return !!(chainInformation as ExtendedChainInformation).nativeCurrency;
}

const getInfuraUrlFor = (network: string) =>
  process.env.infuraKey
    ? `https://${network}.infura.io/v3/${process.env.infuraKey}`
    : "";
const getAlchemyUrlFor = (network: string) =>
  process.env.alchemyKey
    ? `https://${network}.alchemyapi.io/v2/${process.env.alchemyKey}`
    : "";

type ChainConfig = {
  [chainId: number]: BasicChainInformation | ExtendedChainInformation;
};

export const MAINNET_CHAINS: ChainConfig = {
  1: {
    urls: [
      getInfuraUrlFor("mainnet"),
      getAlchemyUrlFor("eth-mainnet"),
      "https://cloudflare-eth.com",
    ].filter(Boolean),
    name: "Mainnet",
  },
  10: {
    urls: [
      getInfuraUrlFor("optimism-mainnet"),
      "https://mainnet.optimism.io",
    ].filter(Boolean),
    name: "Optimism",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://optimistic.etherscan.io"],
  },
  42161: {
    urls: [
      getInfuraUrlFor("arbitrum-mainnet"),
      "https://arb1.arbitrum.io/rpc",
    ].filter(Boolean),
    name: "Arbitrum One",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://arbiscan.io"],
  },
};

export const TESTNET_CHAINS: ChainConfig = {
  5: {
    urls: [getInfuraUrlFor("goerli")].filter(Boolean),
    name: "Görli",
  },
  11155111: {
    urls: [getInfuraUrlFor("sepolia")].filter(Boolean),
    name: "Sepolia",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://sepolia.etherscan.io"],
  },
  1337: {
    urls: ["https://远程.ip"],
    nativeCurrency: ETH,
    name: "Location",
  },
  420: {
    urls: [
      getInfuraUrlFor("optimism-goerli"),
      "https://goerli.optimism.io",
    ].filter(Boolean),
    name: "Optimism Goerli",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://goerli-explorer.optimism.io"],
  },
  421613: {
    urls: [
      getInfuraUrlFor("arbitrum-goerli"),
      "https://goerli-rollup.arbitrum.io/rpc",
    ].filter(Boolean),
    name: "Arbitrum Goerli",
    nativeCurrency: ETH,
    blockExplorerUrls: ["https://testnet.arbiscan.io"],
  },
};

export const CHAINS: ChainConfig = {
  ...MAINNET_CHAINS,
  ...TESTNET_CHAINS,
};

export const URLS: { [chainId: number]: string[] } = Object.keys(
  CHAINS
).reduce<{
  [chainId: number]: string[];
}>((accumulator, chainId) => {
  const validURLs: string[] = CHAINS[Number(chainId)].urls;

  if (validURLs.length) {
    accumulator[Number(chainId)] = validURLs;
  }

  return accumulator;
}, {});
export function getAddChainParameters(
  chainId: number
): AddEthereumChainParameter | number {
  const chainInformation = CHAINS[chainId];
  if (isExtendedChainInformation(chainInformation)) {
    return {
      chainId,
      chainName: chainInformation.name,
      nativeCurrency: chainInformation.nativeCurrency,
      rpcUrls: chainInformation.urls,
      blockExplorerUrls: chainInformation.blockExplorerUrls,
    };
  } else {
    return chainId;
  }
}
