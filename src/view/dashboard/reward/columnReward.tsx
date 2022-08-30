import { useSelector } from 'react-redux'
import { MintAvatar, MintSymbol } from '@sen-use/app'

import { Space } from 'antd'

import { AppState } from 'model'

type ColumnRewardProps = {
  rewardAddress: string
}

const ColumnReward = ({ rewardAddress }: ColumnRewardProps) => {
  const mint = useSelector(
    (state: AppState) => state.rewards[rewardAddress].mint,
  )

  return (
    <Space>
      <MintAvatar mintAddress={mint.toBase58()} />
      <MintSymbol mintAddress={mint.toBase58()} />
    </Space>
  )
}

export default ColumnReward
