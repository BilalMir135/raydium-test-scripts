import { Keypair, PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import { BN } from '@coral-xyz/anchor';

import { program, ACCOUNTS } from '../accounts';
import { payerKeypair, SOL } from '../../constants';
import { wrapSOL } from '../utils';

// const liquidity = new BN('128712251019206');
// const amount0Max = new BN('2648000266154');
// const amount1Max = new BN('5014999999999979');
// const tickLowerIndex = new BN(-207360);
// const tickUpperIndex = new BN(73200);
// const tickArrayLowerStartIndex = new BN(-208800);
// const tickArrayUpperStartIndex = new BN(72000);
// const withMetadata = true;
// const baseFlag = null;

const liquidity = new BN('117500335538989');
const amount0Max = new BN('5014999999999991');
const amount1Max = new BN('22314477455');
const tickLowerIndex = new BN(-75120);
const tickUpperIndex = new BN(138240);
const tickArrayLowerStartIndex = new BN(-79200);
const tickArrayUpperStartIndex = new BN(136800);
const withMetadata = true;
const baseFlag = null;

export async function openPositionV2(tokenMint0: PublicKey, tokenMint1: PublicKey) {
  const [poolState] = ACCOUNTS.poolState(tokenMint0, tokenMint1);

  const positionNftMint = Keypair.generate();
  const positionNftAccount = getAssociatedTokenAddressSync(
    positionNftMint.publicKey,
    payerKeypair.publicKey,
    false
  );

  const tokenAccount0 = getAssociatedTokenAddressSync(tokenMint0, payerKeypair.publicKey, true);
  const tokenAccount1 = getAssociatedTokenAddressSync(tokenMint1, payerKeypair.publicKey, true);

  if (tokenMint0.equals(SOL)) {
    await wrapSOL(amount0Max, payerKeypair);
  }

  if (tokenMint1.equals(SOL)) {
    await wrapSOL(amount1Max, payerKeypair);
  }

  const txId = await program.methods
    .openPositionV2(
      tickLowerIndex.toNumber(),
      tickUpperIndex.toNumber(),
      tickArrayLowerStartIndex.toNumber(),
      tickArrayUpperStartIndex.toNumber(),
      liquidity,
      amount0Max,
      amount1Max,
      withMetadata,
      baseFlag
    )
    .accounts({
      payer: payerKeypair.publicKey,
      positionNftOwner: payerKeypair.publicKey,
      positionNftMint: positionNftMint.publicKey,
      positionNftAccount,
      metadataAccount: ACCOUNTS.metadataAccount(positionNftMint.publicKey)[0],
      poolState,
      protocolPosition: ACCOUNTS.protocolPosition(poolState, tickLowerIndex, tickUpperIndex)[0],
      tickArrayLower: ACCOUNTS.tickArray(poolState, tickArrayLowerStartIndex)[0],
      tickArrayUpper: ACCOUNTS.tickArray(poolState, tickArrayUpperStartIndex)[0],
      personalPosition: ACCOUNTS.personalPosition(positionNftMint.publicKey)[0],
      tokenAccount0,
      tokenAccount1,
      tokenVault0: ACCOUNTS.tokenVault(poolState, tokenMint0)[0],
      tokenVault1: ACCOUNTS.tokenVault(poolState, tokenMint1)[0],
      rent: SYSVAR_RENT_PUBKEY,
      systemProgram: SystemProgram.programId,
      tokenProgram: TOKEN_PROGRAM_ID,
      associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
      metadataProgram: ACCOUNTS.metadataProgram,
      tokenProgram2022: TOKEN_2022_PROGRAM_ID,
      vault0Mint: tokenMint0,
      vault1Mint: tokenMint1,
    })
    .signers([payerKeypair, positionNftMint])
    .rpc();

  console.log('---Open Position V2---');
  console.log('txId => ', txId);
}
