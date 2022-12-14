import { useCallback } from 'react'
import { web3 } from '@project-serum/anchor'

import { useRewardByCampaign } from 'hooks/reward/useRewardByCampaign'

export const useGetEstimateReward = (campaign: string) => {
  const rewards = useRewardByCampaign(campaign)

  const getEstimateReward = useCallback(async () => {
    let selectedReward: web3.PublicKey[] = []
    for (const rewardAddr in rewards) {
      const { reservePrize } = rewards[rewardAddr]
      if (!reservePrize.isZero()) {
        selectedReward.push(new web3.PublicKey(rewardAddr))
      }
    }
    // Sort with ratio
    selectedReward = selectedReward.sort((a, b) => {
      const ratioA = rewards[a.toBase58()].toLuckyNumber
      const ratioB = rewards[b.toBase58()].toLuckyNumber
      return ratioA.gt(ratioB) ? 1 : -1
    })
    return selectedReward
  }, [rewards])

  return getEstimateReward
}
