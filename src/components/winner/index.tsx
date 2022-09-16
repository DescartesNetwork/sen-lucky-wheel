import { useCallback, useEffect, useMemo } from 'react'
import { BN } from '@project-serum/anchor'
import { utilsBN } from '@sen-use/web3'

import { Card, Col, Row } from 'antd'
import WinList from './winList'
import IconSax from '@sentre/antd-iconsax'

import { useTicketByCampaign } from 'hooks/ticket/useTicketByCampaign'
import { useSelectedCampaign } from 'hooks/useSelectedCampaign'
import { useLotteryInfo } from 'hooks/useLotteryInfo'
import { useMilestoneByCampaign } from 'hooks/challengeReward/useMilestoneByCampaign'
import { useRewardByCampaign } from 'hooks/reward/useRewardByCampaign'

export type Winner = {
  authority: string
  rewardAddress?: string
  milestone?: BN
}

const Winners = () => {
  const selectedCampaign = useSelectedCampaign()
  const tickets = useTicketByCampaign(selectedCampaign, false)
  const { getListLotteryData } = useLotteryInfo(selectedCampaign)
  const listLottery = getListLotteryData()
  const { getMilestoneCampaign } = useMilestoneByCampaign(selectedCampaign)
  const rewards = useRewardByCampaign(selectedCampaign)

  const processes = getMilestoneCampaign()

  const getAroundedMilestone = useCallback(
    (val: BN) => {
      let result = new BN(0)

      for (const milestone of processes) {
        if (!val.gte(milestone)) continue
        result = milestone
      }
      return result
    },
    [processes],
  )

  const reachedMilestoneList = useMemo(() => {
    const data: Winner[] = []
    for (const { totalPicked, authority } of listLottery) {
      if (data.length > 5) return data

      const lotteryMilestone = getAroundedMilestone(totalPicked)
      if (lotteryMilestone.lte(new BN(0))) continue

      data.push({
        milestone: lotteryMilestone,
        authority: authority.toBase58(),
      })
    }
    return data
  }, [getAroundedMilestone, listLottery])

  const winnersLatestList = useMemo(() => {
    const data: Winner[] = []
    for (const address in tickets) {
      if (data.length > 5) return data
      const { state, reward, authority } = tickets[address]
      if (!state.won && !state.claimed) continue
      data.push({
        authority: authority.toBase58(),
        rewardAddress: reward.toBase58(),
      })
    }
    return data
  }, [tickets])

  const checkReward = useCallback(async () => {
    const result: Record<string, number> = {}
    let totalUsdc = 0
    await Promise.all(
      Object.keys(tickets).map(async (key) => {
        const { state, reward, authority } = tickets[key]
        const rewardData = rewards[reward.toString()]
        if ((!state.won && !state.claimed) || !rewardData) return

        const mint = rewardData.mint.toBase58()
        let price = 0
        let decimals = 9
        if (mint === 'SENBBKVCM7homnf5RX9zqpf1GFe935hnbU4uVzY1Y6M') {
          price = 0.003
        }
        if (mint === 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v') {
          price = 1
          decimals = 6
        }

        const totalReward =
          price * Number(utilsBN.undecimalize(rewardData.prizeAmount, decimals))
        totalUsdc += totalReward
        if (!result[authority.toBase58()]) result[authority.toBase58()] = 0
        result[authority.toBase58()] += totalReward
      }),
    )
    console.log('result', result)
    console.log('totalUsdc', totalUsdc)
  }, [rewards, tickets])

  useEffect(() => {
    checkReward()
  }, [checkReward])

  if (!winnersLatestList.length) return null

  return (
    <Card
      bordered={false}
      style={{ borderRadius: 50, backdropFilter: ' blur(96px)' }}
      bodyStyle={{ padding: 8 }}
    >
      <Row gutter={[8, 8]} wrap={false}>
        <Col>
          <IconSax name="Global" />
        </Col>
        <Col flex="auto">
          <WinList
            data={[...winnersLatestList, ...reachedMilestoneList]}
            height="auto"
          />
        </Col>
      </Row>
    </Card>
  )
}

export default Winners
