import { LocalWallet, SmartWallet } from "@thirdweb-dev/wallets";
import {
  TWFactoryAddress,
  activeChain,
  editionDropAddress,
  editionDropTokenId,
} from "./const/yourDetails.js";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

(async () => {
  // Create a local wallet to be a key for smart wallet
  const localWallet = new LocalWallet();

  await localWallet.generate();

  const localWalletAddress = await localWallet.getAddress();
  console.log(`✨ Local wallet address: ${localWalletAddress}`);

  // Create a smart wallet using the local wallet as the key
  const smartWallet = new SmartWallet({
    chain: activeChain,
    factoryAddress: TWFactoryAddress,
    secretKey: process.env.THIRDWEB_SECRET_KEY,
    gasless: true,
  });

  await smartWallet.connect({
    personalWallet: localWallet,
  });

  const smartWalletAddress = await smartWallet.getAddress();
  console.log(`✨ Smart wallet address: ${smartWalletAddress}`);

  // Instantiate thirdweb SDK with the smart wallet
  // (or you can get signer using smartWallet.getSigner())
  const sdk = await ThirdwebSDK.fromWallet(smartWallet, {
    secretKey: process.env.THIRDWEB_SECRET_KEY,
  });

  try {
    // Claiming access NFT
    const contract = await sdk.getContract(editionDropAddress);
    const claimTxn = await contract.erc1155.claim(editionDropTokenId, 1);
    console.log(
      `🪄 Access NFT claimed! Txn hash: ${claimTxn.receipt.transactionHash}`
    );
  } catch (error) {
    console.error(`❌ Error claiming NFT: ${error.message}`);
  }
})();
