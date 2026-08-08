import { Request, Response, NextFunction } from 'express';
import { ethers } from 'ethers';
import { blockchainService } from './blockchainService';
import { X402Challenge, X402PaymentReceipt } from '../types';

/**
 * Express Middleware for x402 Payment-Required API protection
 */
export function x402PaymentVerificationMiddleware(req: Request, res: Response, next: NextFunction) {
  const serviceId = (req.query.serviceId || req.body?.serviceId) as string;

  if (!serviceId) {
    return res.status(400).json({ error: 'x402 Middleware: Missing serviceId query or body parameter.' });
  }

  const service = blockchainService.getService(serviceId);
  if (!service) {
    return res.status(404).json({ error: `x402 Middleware: Service ${serviceId} not found in Agent Registry.` });
  }

  // Check for X-402-Payment-Receipt or Authorization header
  const paymentReceiptHeader = req.headers['x-402-payment-receipt'] as string || req.headers['authorization'];

  if (!paymentReceiptHeader) {
    // Return HTTP 402 Payment Required with WWW-Authenticate header
    const nonce = '0x' + Math.random().toString(16).substring(2, 10) + Math.random().toString(16).substring(2, 10);
    const challenge: X402Challenge = {
      status: 402,
      message: 'Payment Required to invoke this AI Agent API. Please provide x402 payment receipt header.',
      challenge: {
        protocol: 'x402-v1',
        payToAddress: service.owner,
        amountWei: service.pricePerRequestWei,
        amountFormatted: service.priceFormatted,
        tokenSymbol: 'ETH',
        nonce,
        serviceId: service.id,
        expiresAt: Date.now() + 300000, // 5 min expiry
        realm: 'ai-agent-registry',
        chainId: 8453 // Base L2
      }
    };

    res.setHeader('WWW-Authenticate', `x402 realm="ai-agent-registry", payTo="${service.owner}", priceWei="${service.pricePerRequestWei}", nonce="${nonce}", serviceId="${service.id}"`);
    return res.status(402).json(challenge);
  }

  try {
    let receipt: X402PaymentReceipt;
    if (paymentReceiptHeader.startsWith('{') || paymentReceiptHeader.startsWith('x402 ')) {
      const jsonStr = paymentReceiptHeader.replace(/^x402\s+/, '');
      receipt = JSON.parse(jsonStr);
    } else {
      receipt = JSON.parse(Buffer.from(paymentReceiptHeader, 'base64').toString('utf-8'));
    }

    // Validate receipt fields
    if (receipt.serviceId !== service.id) {
      return res.status(402).json({ error: 'x402 Verification Failed: Service ID mismatch.' });
    }

    if (BigInt(receipt.amountWei) < BigInt(service.pricePerRequestWei)) {
      return res.status(402).json({ error: `x402 Verification Failed: Insufficient payment. Required ${service.pricePerRequestWei} wei.` });
    }

    // Replay attack prevention check
    if (!blockchainService.verifyNonce(receipt.nonce)) {
      return res.status(402).json({ error: 'x402 Verification Failed: Nonce already used (Replay attack detected).' });
    }

    // Verify cryptographic signature (EIP-191 / EIP-712)
    const expectedMessage = `x402 Payment Receipt:\nService: ${receipt.serviceId}\nAmountWei: ${receipt.amountWei}\nNonce: ${receipt.nonce}\nPayTo: ${receipt.payToAddress}`;
    const recoveredAddress = ethers.verifyMessage(expectedMessage, receipt.signature);

    if (recoveredAddress.toLowerCase() !== receipt.clientAddress.toLowerCase()) {
      return res.status(402).json({ error: 'x402 Verification Failed: Cryptographic signature mismatch.' });
    }

    // Attach verified payment context to request object
    (req as any).x402Payment = {
      receipt,
      service,
      clientAddress: recoveredAddress,
      verified: true,
      timestamp: Date.now()
    };

    next();
  } catch (err: any) {
    return res.status(400).json({ error: 'x402 Middleware Error: Malformed x402 payment receipt header. ' + err.message });
  }
}
