import React from 'react';

export function useWallet() {
  // TODO: connect to WalletAdapter via context
  return {
    connect: async () => {
      // placeholder
    },
    disconnect: async () => {},
    address: undefined as string | undefined
  };
}
