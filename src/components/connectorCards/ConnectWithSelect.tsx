import type { Web3ReactHooks } from '@web3-react/core';
import type { MetaMask } from '@web3-react/metamask';
import { useCallback, useEffect, useState } from 'react';
import { CHAINS, getAddChainParameters } from '@utils/chains';

function ChainSelect({
  activeChainId,
  switchChain,
  chainIds,
}: {
  activeChainId: number;
  switchChain: (chainId: number) => void;
  chainIds: number[];
}) {
  return (
    <select
      value={activeChainId}
      onChange={(event) => {
        switchChain(Number(event.target.value));
      }}
      disabled={switchChain === undefined}
    >
      <option hidden disabled>
        Select chain
      </option>
      <option value={-1}>Default</option>
      {chainIds.map((chainId) => (
        <option key={chainId} value={chainId}>
          {CHAINS[chainId]?.name ?? chainId}
        </option>
      ))}
    </select>
  );
}

export function ConnectWithSelect({
  connector,
  activeChainId,
  chainIds = Object.keys(CHAINS)
    .map(Number)
    .filter((id): id is number => id !== undefined) as number[],
  isActivating,
  isActive,
  error,
  setError,
}: {
  connector: MetaMask;
  activeChainId: ReturnType<Web3ReactHooks['useChainId']>;
  chainIds?: (number | undefined)[];
  isActivating: ReturnType<Web3ReactHooks['useIsActivating']>;
  isActive: ReturnType<Web3ReactHooks['useIsActive']>;
  error: Error | undefined;
  setError: (error: Error | undefined) => void;
}) {
  const [desiredChainId, setDesiredChainId] = useState<number | null>(null);

  /**
   * When user connects eagerly (`desiredChainId` is undefined) or to the default chain (`desiredChainId` is -1),
   * update the `desiredChainId` value so that <select /> has the right selection.
   */
  useEffect(() => {
    if (activeChainId && (!desiredChainId || desiredChainId === -1)) {
      setDesiredChainId(activeChainId);
    }
  }, [desiredChainId, activeChainId]);

  const switchChain = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-shadow
    async (desiredChainId: number) => {
      setDesiredChainId(desiredChainId);

      try {
        if (
          // If we're already connected to the desired chain, return
          desiredChainId === activeChainId ||
          // If they want to connect to the default chain and we're already connected, return
          (desiredChainId === -1 && activeChainId !== undefined)
        ) {
          setError(undefined);
          return;
        }

        if (desiredChainId === -1) {
          //如果你没有给chainid 或者 你给过去chainid == 当前用户的 啥也不做了
          await connector.activate();
        } else {
          await connector.activate(getAddChainParameters(desiredChainId));
        }

        setError(undefined);
      } catch (err) {
        setError(err as Error);
      }
    },
    [connector, activeChainId, setError]
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      <ChainSelect
        activeChainId={desiredChainId ?? -1}
        switchChain={switchChain}
        chainIds={chainIds.filter((id): id is number => id !== undefined)}
      />

      <div style={{ marginBottom: '1rem' }} />
      {isActive ? (
        error ? (
          <button
            onClick={() =>
              desiredChainId !== null && switchChain(desiredChainId)
            }
          >
            Try again?
          </button>
        ) : (
          <button
            onClick={() => {
              //需不需要真正的进行断开链接
              if (connector?.deactivate) {
                void connector.deactivate();
              } else {
                //状态清空
                void connector.resetState();
              }
              //用户断开链接的时候 清空desiredChainId
              setDesiredChainId(null);
            }}
          >
            Disconnect
          </button>
        )
      ) : (
        <button
          onClick={() => desiredChainId !== null && switchChain(desiredChainId)}
          disabled={isActivating || !desiredChainId}
        >
          {error ? 'Try again?' : 'Connect'}
        </button>
      )}
    </div>
  );
}
