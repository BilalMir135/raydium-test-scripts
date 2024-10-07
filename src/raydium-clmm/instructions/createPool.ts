import { PublicKey, SystemProgram, SYSVAR_RENT_PUBKEY } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { BN } from '@coral-xyz/anchor';

import { program, ACCOUNTS } from '../accounts';
import { payerKeypair, CONNECTION } from '../../constants';

// const sqrtPriceX64 = new BN('714439325892274560480');
const sqrtPriceX64 = new BN('434793927511266657');
const openTime = new BN(0);

export async function createPool(tokenMint0: PublicKey, tokenMint1: PublicKey) {
  const [poolState] = ACCOUNTS.poolState(tokenMint0, tokenMint1);

  const seed = poolState.toString().slice(0, 10);

  const observationState = await PublicKey.createWithSeed(
    payerKeypair.publicKey,
    seed,
    program.programId
  );

  const createOSIx = SystemProgram.createAccountWithSeed({
    fromPubkey: payerKeypair.publicKey,
    basePubkey: payerKeypair.publicKey,
    seed,
    newAccountPubkey: observationState,
    lamports: await CONNECTION.getMinimumBalanceForRentExemption(52121),
    space: 52121,
    programId: program.programId,
  });

  const txId = await program.methods
    .createPool(sqrtPriceX64, openTime)
    .preInstructions([createOSIx])
    .accounts({
      poolCreator: payerKeypair.publicKey,
      ammConfig: ACCOUNTS.ammConfig,
      poolState,
      tokenMint0,
      tokenMint1,
      tokenVault0: ACCOUNTS.tokenVault(poolState, tokenMint0)[0],
      tokenVault1: ACCOUNTS.tokenVault(poolState, tokenMint1)[0],
      observationState,
      tickArrayBitmap: ACCOUNTS.tickArrayBitMap(poolState)[0],
      tokenProgram0: TOKEN_PROGRAM_ID,
      tokenProgram1: TOKEN_PROGRAM_ID,
      systemProgram: SystemProgram.programId,
      rent: SYSVAR_RENT_PUBKEY,
    })
    .signers([payerKeypair])
    .rpc();

  console.log('---Created Pool---');
  console.log('txId => ', txId);
}
