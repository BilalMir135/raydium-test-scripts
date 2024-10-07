import { Keypair, Transaction, SystemProgram, sendAndConfirmTransaction } from '@solana/web3.js';
import { getOrCreateAssociatedTokenAccount, createSyncNativeInstruction } from '@solana/spl-token';
import { BN } from '@coral-xyz/anchor';

import { CONNECTION, SOL } from '../constants';

export function i32ToBytes(num: number) {
  const arr = new ArrayBuffer(4);
  const view = new DataView(arr);
  view.setInt32(0, num, false);
  return new Uint8Array(arr);
}

export async function wrapSOL(amount: BN, payer: Keypair) {
  const wrapSOLATA = await getOrCreateAssociatedTokenAccount(
    CONNECTION,
    payer,
    SOL,
    payer.publicKey,
    true
  );

  const solTransferTransaction = new Transaction().add(
    SystemProgram.transfer({
      fromPubkey: payer.publicKey,
      toPubkey: wrapSOLATA.address,
      lamports: amount.toNumber(),
    }),
    createSyncNativeInstruction(wrapSOLATA.address)
  );

  const txId = await sendAndConfirmTransaction(CONNECTION, solTransferTransaction, [payer]);

  console.log('Wrapped SOL => ', txId);
}
