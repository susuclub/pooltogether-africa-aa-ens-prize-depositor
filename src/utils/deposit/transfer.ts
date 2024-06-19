import { encodeFunctionData } from 'viem';
import { erc20ABI, vaultABI } from '@generationsoftware/hyperstructure-client-js';
import { USDC, suPrzUSDC } from '../constants/addresses.js';

export const transfer = (from: `0x${string}`, to: `0x${string}`, amount: bigint ) => {
    const transferData = encodeFunctionData({
        abi: erc20ABI,
        functionName: 'transferFrom',
        args: [(from), (to), (amount)]
    })

    // Build the transactions
    const transferTx = {
        to: USDC,
        data: transferData,
    };
    return transferTx
}