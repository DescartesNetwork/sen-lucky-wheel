import { useCallback, useState } from 'react'
import { web3 } from '@project-serum/anchor'

import { useChallengeRewardByCampaign } from 'hooks/challengeReward/useChallengeRewardByCampaign'
import { useSelectedCampaign } from 'hooks/useSelectedCampaign'
import { useChallengeReceipts } from 'hooks/useChallengeReceipt'
import { notifyError } from 'helper'
import { useGetTokenAccountByChallengeReward } from 'hooks/challengeReward/useGetTokenAccountByChallengeReward'

export const useClaimChallengeReward = () => {
  const [loading, setLoading] = useState(false)
  const selectedCampaign = useSelectedCampaign()
  const { checkExistedReceipt } = useChallengeReceipts()
  const challengeReward = useChallengeRewardByCampaign(selectedCampaign)
  const getAccounts = useGetTokenAccountByChallengeReward()

  const getMintReward = useCallback(
    async (challengeRewardAddr: string) => {
      const splt = window.sentre.splt
      const { mint } = challengeReward[challengeRewardAddr]
      const { challengeRewardTreasurer } =
        await window.luckyWheel.deriveChallengeRewardPDAs(
          new web3.PublicKey(challengeRewardAddr),
          mint,
        )
      const { value } = await splt.connection.getTokenAccountsByOwner(
        challengeRewardTreasurer,
        { programId: splt.spltProgramId },
      )

      for (const valData of value) {
        const accountData = splt.parseAccountData(valData.account.data)
        if (Number(accountData.amount.toString()) > 0)
          return new web3.PublicKey(accountData.mint)
      }

      throw new Error("Can't find account")
    },
    [challengeReward],
  )

  const onClaimChallengeReward = useCallback(
    async (challengeAddresses: string[]) => {
      try {
        setLoading(true)
        const transactions: web3.Transaction[] = []
        for (const address of challengeAddresses) {
          const isClaimed = await checkExistedReceipt(address)
          if (isClaimed) continue
          const {
            mint: mintReward,
            rewardType,
            amount,
          } = challengeReward[address]

          //Check treasury
          const accounts = await getAccounts(address)
          const accountData = accounts.find(
            ({ mint }) => mint === mintReward.toBase58(),
          )
          if (!accountData || Number(accountData.amount) < amount.toNumber())
            throw new Error(
              'The reward has expired, contact admin to deposit more',
            )

          let mint = mintReward
          if (rewardType.nftCollection) mint = await getMintReward(address)

          const tx = new web3.Transaction()
          const { tx: txClaim } = await window.luckyWheel.claimChallengeReward({
            challengeReward: new web3.PublicKey(address),
            rewardMint: mint,
            sendAndConfirm: false,
          })
          tx.add(txClaim)
          transactions.push(tx)
        }

        await window.luckyWheel.provider.sendAll(
          transactions.map((tx) => {
            return { tx }
          }),
        )

        return window.notify({
          type: 'success',
          description: 'Claimed reward successfully!',
        })
      } catch (error) {
        notifyError(error)
      } finally {
        setLoading(false)
      }
    },
    [challengeReward, checkExistedReceipt, getAccounts, getMintReward],
  )

  return { onClaimChallengeReward, loading }
}
