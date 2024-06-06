import { walletClient } from '../viem/client.js'
import { BiconomySmartAccountV2, PaymasterMode, createSmartAccountClient } from '@biconomy/account'
import dotenv from 'dotenv'
import { config } from '../wagmi/config.js';
import { simulateContract } from '@wagmi/core';
import { deposit } from '../deposit/deposit.js';


dotenv.config();

let smartAccount: BiconomySmartAccountV2 | undefined = undefined
let smartAccountAddress: `0x${string}` | undefined = undefined

export const createSmartAccount = async () => {
    try {
        if (!walletClient) return;

        const smartAccountFromCreate = await createSmartAccountClient({
            signer: walletClient,
            bundlerUrl: process.env.BICONOMY_BUNDLER_URL as string, // <-- Read about this at https://docs.biconomy.io/dashboard#bundler-url
            biconomyPaymasterApiKey: process.env.BICONOMY_PAYMASTER_API_KEY as string, // <-- Read about at https://docs.biconomy.io/dashboard/paymaster
        });
    
        const address = await smartAccountFromCreate.getAccountAddress();
        smartAccountAddress = (address);
        console.log('smart account wallet:', smartAccountAddress)
        smartAccount = (smartAccountFromCreate);
    } catch (error) {
        console.log(error)
    }
};

export const smartUserDepositOP = async(amount: bigint, pooler: `0x${string}`) => {

    try {
        if (amount > BigInt(0)) {
            let txnHash

            await createSmartAccount()

            const poolDeposit = async() => {

                const depositPrzTx = deposit(amount, pooler)

                // Send the transaction and get the transaction hash
                const userOpResponse = await smartAccount!.sendTransaction(depositPrzTx, {
                    paymasterServiceData: {mode: PaymasterMode.SPONSORED},
                });
                const { transactionHash } = await userOpResponse.waitForTxHash();
                console.log("Transaction Hash", transactionHash);
                txnHash = transactionHash
                const userOpReceipt  = await userOpResponse?.wait();
                if(userOpReceipt?.success == 'true') { 
                    console.log("UserOp receipt", userOpReceipt)
                    console.log("Transaction receipt", userOpReceipt?.receipt)
                }
            }
            await poolDeposit()
            return  txnHash 
            }
    } catch (error) {
        console.log(error)
    }
}
