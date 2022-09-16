import { TicketData } from '@sentre/lucky-wheel-core'
import { useCallback } from 'react'
import { useTicketByCampaign } from './ticket/useTicketByCampaign'
import { useSelectedCampaign } from './useSelectedCampaign'

const useGetTicketByAddress = () => {
  const selectedCampaign = useSelectedCampaign()
  const tickets = useTicketByCampaign(selectedCampaign, false)

  const getTicketByAddress = useCallback(
    (address: string) => {
      const data: TicketData[] = []
      for (const ticket of Object.values(tickets)) {
        const { state, authority } = ticket
        if (!state.won && !state.claimed) continue
        if (address !== authority.toBase58()) continue

        data.push(ticket)
      }
      return data
    },
    [tickets],
  )

  return getTicketByAddress
}

export default useGetTicketByAddress
