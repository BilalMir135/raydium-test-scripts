import { PublicKey, Keypair } from '@solana/web3.js';
import { Program, BN } from '@coral-xyz/anchor';

import { IDL, AmmV3 } from './idl';
import { i32ToBytes } from './utils';

export const RAYDIUM_CLMM = new PublicKey('devi51mZmdwUJGU9hjN27vEz64Gps7uUefqxg27EAtH');

export const program = new Program(IDL, RAYDIUM_CLMM) as Program<AmmV3>;

export const ACCOUNTS = {
  ammConfig: new PublicKey('GjLEiquek1Nc2YjcBhufUGFRkaqW1JhaGjsdFd8mys38'),
  metadataProgram: new PublicKey('metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s'),
  memoProgram: new PublicKey('MemoSq4gqABAXKb96qnH8TysNcWxMyWCqXgDLGmfcHr'),
  poolState: (tokenMint0: PublicKey, tokenMint1: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [
        Buffer.from('pool'),
        ACCOUNTS.ammConfig.toBuffer(),
        tokenMint0.toBuffer(),
        tokenMint1.toBuffer(),
      ],
      program.programId
    ),
  tokenVault: (poolState: PublicKey, tokenMint: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from('pool_vault'), poolState.toBuffer(), tokenMint.toBuffer()],
      program.programId
    ),
  tickArrayBitMap: (poolState: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from('pool_tick_array_bitmap_extension'), poolState.toBuffer()],
      program.programId
    ),
  protocolPosition: (poolState: PublicKey, tickLowerIndex: BN, tickUpperIndex: BN) =>
    PublicKey.findProgramAddressSync(
      [
        Buffer.from('position'),
        poolState.toBuffer(),
        i32ToBytes(tickLowerIndex.toNumber()),
        i32ToBytes(tickUpperIndex.toNumber()),
      ],
      program.programId
    ),
  tickArray: (poolState: PublicKey, tickArray: BN) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from('tick_array'), poolState.toBuffer(), i32ToBytes(tickArray.toNumber())],
      program.programId
    ),
  personalPosition: (positionNftMint: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [Buffer.from('position'), positionNftMint.toBuffer()],
      program.programId
    ),
  metadataAccount: (positionNftMint: PublicKey) =>
    PublicKey.findProgramAddressSync(
      [
        Buffer.from('metadata', 'utf-8'),
        ACCOUNTS.metadataProgram.toBuffer(),
        positionNftMint.toBuffer(),
      ],
      ACCOUNTS.metadataProgram
    ),
};
