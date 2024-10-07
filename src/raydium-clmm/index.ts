import { PublicKey } from '@solana/web3.js';
import { createPool } from './instructions/createPool';
import { openPositionV2 } from './instructions/openPositionV2';
import { swapV2 } from './instructions/swapv2';
import { decreaseLiquidityV2 } from './instructions/decreaseLiquidityV2';

// const token0 = new PublicKey('B3FneZvPh3TYcJCt3qF1BxNY3kKiXodzS9wZ2UUZwvwH');
// const token1 = new PublicKey('FDNHxgD4ABK2KHqmZtoBjqmXM3exR1Q3asfp5QQ2GeNV');

const token0 = new PublicKey('MESHwqmXvAmKpDYSgRZkm9D5H8xYSCVixeyZoePHn4G');
const token1 = new PublicKey('So11111111111111111111111111111111111111112');

async function main() {
  // await createPool(token0, token1);
  // await openPositionV2(token0, token1);
  await swapV2(token0, token1);
  // await decreaseLiquidityV2(token0, token1);
}

main();
