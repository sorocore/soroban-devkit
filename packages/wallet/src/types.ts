export interface WalletAdapter {
  connect(): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;
  getAddress(): Promise<string>;
}
