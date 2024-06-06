import express, { Express, Request, Response } from 'express'
import { config } from './utils/wagmi/config.js'
import { watchContractEvent } from '@wagmi/core'
import { createSmartAccount, smartUserDepositOP } from './utils/biconomy/smartUserOP.js'
import { Recipient, USDC } from './utils/constants/addresses.js'
import { erc20Abi, formatUnits } from 'viem'
import { getPooler } from './utils/pooler/getPooler.js'
import { postPoolerDeposit } from './utils/pooler/postPoolerDeposit.js'
import { sendEmail } from './mail/sendEmail.js'
import { getPoolers } from './utils/pooler/getPoolers.js'



const app: Express = express();
const port = process.env.PORT || 8000;
let walletsToWatch: `0x${string}`[] | undefined = undefined

app.get("/", (req: Request, res: Response) => {
  res.send("Express + TypeScript Server");
});

const watchWallets = async() => {
  const _walletsToWatch = await getPoolers()!
  if (JSON.stringify(walletsToWatch) !== JSON.stringify(_walletsToWatch)) {
    walletsToWatch = _walletsToWatch
    startEventWatcher()
    console.log('Updated wallets to watch:', walletsToWatch);
  }
}

const startEventWatcher = async() => {
  await watchWallets();

  if (!walletsToWatch) {
    console.error('No wallets to watch. Exiting.');
    return;
  }
  
  const unwatch = watchContractEvent(config, {
    abi: erc20Abi,
    chainId: 8453,
    address: USDC,
    eventName: 'Transfer',
    args: {
      to: walletsToWatch //static AA wallet address
    },
    onLogs(logs) {
      console.log('Logs changed!', logs)
      //loop logs async
      const loopLogs = async() => {
        for (let i = 0; i < logs.length; i++) {
          const log = logs[i];
          console.log(`doing log ${i}`)
          const to = log.args.to
          const from = log.args.from
          const amount = log.args.value
          const PoolDepositSendEmail = async () => {
            //get user from pta db
            const pooler = await getPooler(to!)
  
            //ckeck log info for address mathcing one from PTA db
            //if match send winning info to db and send email
            
            //swap and deposit for winner
            const poolDepositTx = await smartUserDepositOP(
                amount!,
                to!
            )
            console.log(poolDepositTx)
            //send email
            console.log(pooler?.email)
            const amountPrzUSDC = formatUnits(amount!, 6)
            await sendEmail(pooler?.email!, pooler?.ens!, Number(amountPrzUSDC).toFixed(2))
            //post reward info to susu.club DB
            await postPoolerDeposit(to!, from!, poolDepositTx!, Number(amountPrzUSDC).toFixed(2), 'reward')
            
          }
          //await PoolDepositSendEmail()
        }
      }
      //loopLogs()
    },
    onError(err) {
      console.log('err found!', err)
    }
  })

  // Log that watching has started
  console.log("Started watching contract events");
};


app.listen(port, async() => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
  startEventWatcher()
  createSmartAccount()
  watchWallets();
  setInterval(watchWallets, 3000);
});
