import { AnchorProvider, Wallet } from '@coral-xyz/anchor';
import { Connection, clusterApiUrl, Keypair, PublicKey } from '@solana/web3.js';
import base58 from 'bs58';

import keys from '../../keys.json';

export const CONNECTION = new Connection(clusterApiUrl('devnet'));

export const payerKeypair = Keypair.fromSecretKey(base58.decode(keys.payer));
export const account0 = Keypair.fromSecretKey(base58.decode((keys as any).account));

export const anchorWallet = new Wallet(payerKeypair);

export const anchorProvider = new AnchorProvider(CONNECTION, anchorWallet, {
  commitment: 'confirmed',
});

export const SOL = new PublicKey('So11111111111111111111111111111111111111112');
