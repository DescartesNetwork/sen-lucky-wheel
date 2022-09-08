import { useChallengeRewardByCampaign } from './challengeReward/useChallengeRewardByCampaign'
import { useSelectedCampaign } from './useSelectedCampaign'

const ONE_HUNDRED = 100
const EXTRA_PECENT = 10

const useChallengePecent = () => {
  const selectedCampaign = useSelectedCampaign()
  const challengeRewards = useChallengeRewardByCampaign(selectedCampaign)
  const nextChallenge = Object.values(challengeRewards)
  const sortedChallenge = nextChallenge.sort((a, b) =>
    a.totalPicked.toNumber() > b.totalPicked.toNumber() ? 1 : -1,
  )

  console.log(nextChallenge)

  const totalChallenge =
    sortedChallenge[sortedChallenge.length - 1]?.totalPicked.toNumber() || 0

  return ONE_HUNDRED / (totalChallenge + EXTRA_PECENT)
}

export default useChallengePecent
