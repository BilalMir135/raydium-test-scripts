import { PublicKey } from '@solana/web3.js';
import * as multisig from '@sqds/multisig';

import { CONNECTION } from '../constants';

const txId =
  'DKYP19saauRLMtnxeiyKokTocjib5gJFxP9HygggGJcr5mqYEDNRwRwzgWDGGWXwrLaUTsyW99M98dC1ytTW6QG';

const MULTISIGN_KEY = new PublicKey('2YF1MKK32LPucNLtNpRfzX2xUTpwZw9upnVxVw5Pnsz5');

async function main() {
  //   const txn = await CONNECTION.getTransaction(txId);
  //   console.dir(txn, { depth: null });

  const multisigPda = multisig.getMultisigPda({
    // The createKey has to be a Public Key, see accounts reference for more info
    createKey: new PublicKey('vbVtdjdjLeHr5tvKmRXcv1fnvuqZqbc2hu4bDgr8nV3'),
  })[0];

  console.log(multisigPda.toBase58());

  // const balance = await CONNECTION.getBalance(
  //   new PublicKey('A2eMCBb3iBJ9zLo66ExKNYaCXSE6j77Rud5JEgTWkax5')
  // );
  // console.log(balance);
}

main();
