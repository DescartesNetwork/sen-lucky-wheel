import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { web3 } from '@project-serum/anchor'

import { initRewards, upsetReward } from 'model/rewards.controller'
import Watcher from './watcher'

// TODO: Config
const NAME = 'reward'
const FILTER: web3.GetProgramAccountsFilter[] = []

const RewardsWatcher = () => {
  const dispatch = useDispatch()

  // TODO: init all account data
  const init = useCallback((data) => dispatch(initRewards(data)), [dispatch])
  // TODO: upset account data
  const upset = useCallback(
    (key: string, value: any) =>
      dispatch(upsetReward({ address: key, data: value })),
    [dispatch],
  )

  return (
    <Watcher
      program={window.luckyWheel.program}
      name={NAME}
      filter={FILTER}
      init={init}
      upset={upset}
    />
  )
}
export default RewardsWatcher
