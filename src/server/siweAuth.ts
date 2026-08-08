import { ethers } from 'ethers';
import { SIWESession } from '../types';

class SIWEAuthService {
  private activeNonces: Map<string, { nonce: string; expiresAt: number }> = new Map();
  private sessions: Map<string, SIWESession> = new Map();

  public generateNonce(address: string): string {
    const nonce = ethers.hexlify(ethers.randomBytes(16)).substring(2);
    this.activeNonces.set(address.toLowerCase(), {
      nonce,
      expiresAt: Date.now() + 600000, // 10 mins
    });
    return nonce;
  }

  public generateSIWEMessage(address: string, nonce: string, chainId: number = 8453): string {
    const domain = 'ai-agent-registry.eth';
    const uri = 'https://ai-agent-registry.eth/login';
    const issuedAt = new Date().toISOString();

    return `${domain} wants you to sign in with your Ethereum account:\n${address}\n\nAI Agent Service Registry SIWE Authentication.\n\nURI: ${uri}\nVersion: 1\nChain ID: ${chainId}\nNonce: ${nonce}\nIssued At: ${issuedAt}`;
  }

  public async verifySignature(
    address: string,
    message: string,
    signature: string
  ): Promise<{ success: boolean; session?: SIWESession; error?: string }> {
    try {
      const recoveredAddress = ethers.verifyMessage(message, signature);
      if (recoveredAddress.toLowerCase() !== address.toLowerCase()) {
        return { success: false, error: 'Signature verification failed. Address mismatch.' };
      }

      // Check nonce
      const nonceMatch = message.match(/Nonce: ([a-zA-Z0-9]+)/);
      if (!nonceMatch) {
        return { success: false, error: 'Invalid SIWE message format. Missing nonce.' };
      }

      const token = ethers.keccak256(ethers.toUtf8Bytes(address + signature + Date.now().toString()));
      const session: SIWESession = {
        address,
        chainId: 8453,
        nonce: nonceMatch[1],
        issuedAt: new Date().toISOString(),
        token,
      };

      this.sessions.set(token, session);
      return { success: true, session };
    } catch (err: any) {
      return { success: false, error: err.message || 'Verification exception' };
    }
  }

  public getSession(token: string): SIWESession | undefined {
    return this.sessions.get(token);
  }
}

export const siweAuthService = new SIWEAuthService();
