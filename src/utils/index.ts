import { MetaMask } from '@web3-react/metamask'
import type { Connector } from '@web3-react/types'

export function getName(connector: Connector) {
  if (connector instanceof MetaMask) return 'MetaMask'
  return 'Unknown'
}

export const formatWalletAddress = (
  address: string,
  startLength: number = 6,
  endLength: number = 4
): string => {
  if (!address) return '';

  // 检查地址长度是否足够进行格式化
  if (address.length <= startLength + endLength) {
    return address;
  }

  // 移除可能的前缀
  const cleanAddress = address.startsWith('0x') ? address.slice(2) : address;

  // 获取起始和结束部分
  const start = cleanAddress.slice(0, startLength);
  const end = cleanAddress.slice(-endLength);

  // 如果原地址有0x前缀，添加回去
  const prefix = address.startsWith('0x') ? '0x' : '';

  return `${prefix}${start}...${end}`;
};