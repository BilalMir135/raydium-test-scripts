import { PublicKey } from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import { BN } from '@coral-xyz/anchor';

import { program, ACCOUNTS } from '../accounts';
import { payerKeypair } from '../../constants';
import { wrapSOL } from '../utils';

// const amount = new BN('666000000000');
// const otherAmountThreshold = new BN('0');
// const sqrtPriceLimitx64 = new BN('59616246343421125895');
// const isBaseInput = true;

const amount = new BN('20000000');
const otherAmountThreshold = new BN('0');
const sqrtPriceLimitx64 = new BN('79226673521066979257578248090');
const isBaseInput = true;

export async function swapV2(tokenMint0: PublicKey, tokenMint1: PublicKey) {
  const [poolState] = ACCOUNTS.poolState(tokenMint0, tokenMint1);
  const temp = tokenMint0;
  tokenMint0 = tokenMint1;
  tokenMint1 = temp;
  // const observationState = new PublicKey('C7ucvVRRNF72FqhgfLsTCDCoLkUwnJ2aYJVA8DRtK2xU');
  // const tickArrayLower = new PublicKey('WF6e2iL2hw1LM4nb6Cp4XhLppgA2A37GnuTkSXsToiQ');
  // const tickArrayUpper = new PublicKey('EDoTvcun9g4jjdH4SVacRgPQCHtrQhqx9RDrGPWtRjSz');

  const observationState = new PublicKey('52rq6WnT4NjrCbNN66YK53Z5jANUoPx4tqmnkVM5MnkF');
  const tickArrayLower = new PublicKey('8TeA4Ng4vdFmgwEkrERvtaNTEC9vYM3sNGF31SaQj5q2');
  const tickArrayUpper = new PublicKey('ADrLCcGXNWFwzeW3PaDTKhCF3ed4ZU9PLiQqNxkpdnaL');

  // await wrapSOL(amount, payerKeypair);

  const inputTokenAccount = getAssociatedTokenAddressSync(tokenMint0, payerKeypair.publicKey, true);
  const outputTokenAccount = getAssociatedTokenAddressSync(
    tokenMint1,
    payerKeypair.publicKey,
    true
  );

  const txId = await program.methods
    .swapV2(amount, otherAmountThreshold, sqrtPriceLimitx64, isBaseInput)
    .accounts({
      payer: payerKeypair.publicKey,
      ammConfig: ACCOUNTS.ammConfig,
      poolState,
      inputTokenAccount,
      outputTokenAccount,
      inputVault: ACCOUNTS.tokenVault(poolState, tokenMint0)[0],
      outputVault: ACCOUNTS.tokenVault(poolState, tokenMint1)[0],
      observationState,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenProgram2022: TOKEN_2022_PROGRAM_ID,
      memoProgram: ACCOUNTS.memoProgram,
      inputVaultMint: tokenMint0,
      outputVaultMint: tokenMint1,
    })
    .remainingAccounts([
      { pubkey: ACCOUNTS.tickArrayBitMap(poolState)[0], isSigner: false, isWritable: true },
      // { pubkey: tickArrayUpper, isSigner: false, isWritable: true },
      // { pubkey: tickArrayLower, isSigner: false, isWritable: true },
      { pubkey: tickArrayLower, isSigner: false, isWritable: true },
      { pubkey: tickArrayUpper, isSigner: false, isWritable: true },
    ])
    .signers([payerKeypair])
    .rpc();

  console.log('---Swap V2---');
  console.log('txId => ', txId);
}
