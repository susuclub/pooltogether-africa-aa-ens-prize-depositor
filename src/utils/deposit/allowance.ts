import { erc20Abi } from 'viem'
import { USDC, WETH } from '../constants/addresses.js'
import { publicClient } from '../viem/client.js'


export const allowanceUSD = async (owner: `0x${string}`, spender: `0x${string}`) => {

    const allowanceData = await publicClient.readContract({
        address: USDC,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [(owner), (spender)]
    })

    return allowanceData
    
}
