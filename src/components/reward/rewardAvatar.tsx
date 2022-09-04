import { MintAvatar } from '@sen-use/app'
import { Avatar, Image } from 'antd'

import { EMPTY_ADDRESS } from 'constant'
import { useReward } from 'hooks/reward/useReward'

import GoodLuck from 'static/images/good-luck-icon.png'
import Ticket from 'static/images/ticket-icon.png'

export const RewardAvatar = ({
  rewardAddress,
  size,
}: {
  rewardAddress: string
  size: number
}) => {
  const reward = useReward(rewardAddress)

  // Good luck
  if (!reward?.rewardType || rewardAddress === EMPTY_ADDRESS)
    return <Avatar size={size} shape="circle" src={GoodLuck} />

  // Ticket
  if (reward.rewardType.ticket)
    return (
      <Image
        preview={false}
        style={{ height: size, width: size }}
        src={Ticket}
      />
    )

  // Mint
  return <MintAvatar mintAddress={reward.mint} size={size} />
}