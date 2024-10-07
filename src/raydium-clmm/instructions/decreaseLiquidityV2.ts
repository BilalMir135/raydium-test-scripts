import { PublicKey } from '@solana/web3.js';
import {
  getAssociatedTokenAddressSync,
  TOKEN_PROGRAM_ID,
  TOKEN_2022_PROGRAM_ID,
} from '@solana/spl-token';
import { BN } from '@coral-xyz/anchor';

import { program, ACCOUNTS } from '../accounts';
import { payerKeypair, account0 } from '../../constants';

const liquidity = new BN('0');
const amount0Min = new BN('0');
const amount1Min = new BN('0');
const tickLowerIndex = new BN(-207360);
const tickUpperIndex = new BN(73200);
const tickArrayLowerStartIndex = new BN(-208800);
const tickArrayUpperStartIndex = new BN(72000);

export async function decreaseLiquidityV2(tokenMint0: PublicKey, tokenMint1: PublicKey) {
  const [poolState] = ACCOUNTS.poolState(tokenMint0, tokenMint1);

  const positionNftMint = new PublicKey('BGWnUDaniqEzUbz8yFuef7KuAyvSEzJeBhNnnSvQTsYs');
  // const nftAccount = getAssociatedTokenAddressSync(positionNftMint, payerKeypair.publicKey, false);
  // const recipientTokenAccount0 = getAssociatedTokenAddressSync(
  //   tokenMint0,
  //   payerKeypair.publicKey,
  //   false
  // );
  // const recipientTokenAccount1 = getAssociatedTokenAddressSync(
  //   tokenMint1,
  //   payerKeypair.publicKey,
  //   false
  // );
  const nftAccount = getAssociatedTokenAddressSync(positionNftMint, account0.publicKey, false);
  const recipientTokenAccount0 = getAssociatedTokenAddressSync(
    tokenMint0,
    account0.publicKey,
    false
  );
  const recipientTokenAccount1 = getAssociatedTokenAddressSync(
    tokenMint1,
    account0.publicKey,
    false
  );

  const txId = await program.methods
    .decreaseLiquidityV2(liquidity, amount0Min, amount1Min)
    .accounts({
      nftOwner: account0.publicKey,
      nftAccount,
      personalPosition: ACCOUNTS.personalPosition(positionNftMint)[0],
      poolState,
      protocolPosition: ACCOUNTS.protocolPosition(poolState, tickLowerIndex, tickUpperIndex)[0],
      tokenVault0: ACCOUNTS.tokenVault(poolState, tokenMint0)[0],
      tokenVault1: ACCOUNTS.tokenVault(poolState, tokenMint1)[0],
      tickArrayLower: ACCOUNTS.tickArray(poolState, tickArrayLowerStartIndex)[0],
      tickArrayUpper: ACCOUNTS.tickArray(poolState, tickArrayUpperStartIndex)[0],
      recipientTokenAccount0,
      recipientTokenAccount1,
      tokenProgram: TOKEN_PROGRAM_ID,
      tokenProgram2022: TOKEN_2022_PROGRAM_ID,
      memoProgram: ACCOUNTS.memoProgram,
      vault0Mint: tokenMint0,
      vault1Mint: tokenMint1,
    })

    .signers([account0])
    .rpc();

  console.log('---Decrease Liquidity V2---');
  console.log('txId => ', txId);
}
