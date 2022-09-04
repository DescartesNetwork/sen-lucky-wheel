import { useCallback } from 'react'
import { web3, BN } from '@project-serum/anchor'

export type PickerData = {
  ticket: web3.PublicKey
  recoveryId: number
  signature: number[]
  luckyNumber: BN
}

const generate_lucky_number = (signature: number[]) => {
  let lucky_number = new BN(0)
  for (let i = 0; i < 18; i++) {
    let val = new BN(signature[i] % 10)
    lucky_number = lucky_number.add(val.mul(new BN(1 + '0'.repeat(i))))
  }
  return lucky_number
}

export const useGetTicketPickerData = () => {
  const getTicketPickerData = useCallback(
    async (ticketAddress: string): Promise<PickerData> => {
      // const { data: pickerData } = await axios.get<{
      //   pubKey: string
      //   signature: string
      //   recid: number
      // }>(configs.api.lottery.luckyNumber + ticketAddress, {
      //   withCredentials: true,
      // })
      const pickerData = window.luckyWheel.picker.sign(
        new web3.PublicKey(ticketAddress).toBuffer(),
      )
      // const signature = Array.from(Buffer.from(pickerData.signature, 'hex'))
      const signature = Array.from(pickerData.signature)
      return {
        ticket: new web3.PublicKey(ticketAddress),
        recoveryId: pickerData.recid,
        signature,
        luckyNumber: generate_lucky_number(signature),
      }
    },
    [],
  )

  return getTicketPickerData
}
