import { useCallback, useState } from 'react'
import { PublicKey, Transaction } from '@solana/web3.js'
import BN from 'bn.js'
import { getAnchorProvider } from '@sen-use/web3'
import { rpc, useWalletAddress } from '@sentre/senhub'

import { notifyError, notifySuccess } from 'helper'

type prizeStructures = {
  mint: string
  numberOfReward: number
}

type DepositDataProps = {
  campaignAddress: string
  prizeStructures: prizeStructures[]
}

export const useDepositReward = () => {
  const address = useWalletAddress()
  const provider = getAnchorProvider(rpc, address, window.sentre.wallet)
  const [loading, setLoading] = useState(false)

  const depositReward = useCallback(
    async ({ campaignAddress, prizeStructures }: DepositDataProps) => {
      try {
        setLoading(true)
        const trans = new Transaction()

        for (const prize of prizeStructures) {
          const rewardPDA = await window.luckyWheel.deriveRewardPDAs(
            new PublicKey(campaignAddress),
            new PublicKey(prize.mint),
          )
          const { tx: txDeposit } = await window.luckyWheel.depositReward({
            reward: rewardPDA.reward,
            totalPrize: new BN(prize.numberOfReward),
            sendAndConfirm: false,
          })
          trans.add(txDeposit)
        }
        const txIds = await provider.sendAndConfirm(trans)
        return notifySuccess('Deposit reward', txIds)
      } catch (error: any) {
        notifyError(error)
      } finally {
        setLoading(false)
      }
    },
    [provider],
  )

  return { depositReward, loading }
}
