import React from 'react';

export const WalletProvider: React.FC<{children?: React.ReactNode}> = ({children}) => {
  // TODO: provide wallet adapters and DI
  return <>{children}</>;
};
