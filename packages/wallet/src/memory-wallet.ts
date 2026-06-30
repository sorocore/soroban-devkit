import type { WalletAdapter } from './types';

export class MemoryWallet implements WalletAdapter {
  private address?: string;
  private connected = false;

  async connect(): Promise<void> {
    // placeholder: generate ephemeral address
    this.address = 'GXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';
    this.connected = true;
  }
  async disconnect(): Promise<void> {
    this.connected = false;
  }
  isConnected(): boolean {
    return this.connected;
  }
  async getAddress(): Promise<string> {
    if (!this.address) throw new Error('Not connected');
    return this.address;
  }
}
