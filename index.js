import { LocalWallet, SmartWallet } from "@thirdweb-dev/wallets";
import {
  TWApiKey,
  TWFactoryAddress,
  activeChain,
  editionDropAddress,
  editionDropTokenId,
} from "./const/yourDetails.js";
import { ThirdwebSDK } from "@thirdweb-dev/sdk";

(async () => {
  // Create a local wallet to be a key for smart wallet
  const localWallet = new LocalWallet({
    chain: activeChain,
    chains: [activeChain],
  });

  await localWallet.generate();

  const localWalletAddress = await localWallet.getAddress();
  console.log(`✨ Local wallet address: ${localWalletAddress}`);

  // Create a smart wallet using the local wallet as the username (and the key)
  const smartWallet = new SmartWallet({
    chain: activeChain,
    chains: [activeChain],
    factoryAddress: TWFactoryAddress,
    thirdwebApiKey: TWApiKey,
    gasless: true,
  });

  await smartWallet.connect({
    accountId: localWalletAddress,
    personalWallet: localWallet,
  });

  const smartWalletAddress = await smartWallet.getAddress();
  console.log(`✨ Smart wallet address: ${smartWalletAddress}`);

  // Instantiate thirdweb SDK with the smart wallet
  // (or you can get signer using smartWallet.getSigner())
  const sdk = await ThirdwebSDK.fromWallet(smartWallet);

  try {
    // Claiming access NFT
    const contract = await sdk.getContract(editionDropAddress, "edition-drop");
    const claimTxn = await contract.claim(editionDropTokenId, 1);
    console.log(
      `🪄 Access NFT claimed! Txn hash: ${claimTxn.receipt.transactionHash}`
    );
  } catch (error) {
    console.error(`❌ Error claiming NFT: ${error.message}`);
  }
})();
