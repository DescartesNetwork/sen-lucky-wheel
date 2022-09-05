import { Net } from '@sentre/senhub'

/**
 * Contructor
 */
type Conf = {
  node: string
  programId: string
  campaignId: string
}

const conf: Record<Net, Conf> = {
  /**
   * Development configurations
   */
  devnet: {
    node: 'https://api.devnet.solana.com',
    programId: 'Kvjqp3uHm6Efgz5fbYrfY33DCku1gaKKeUm2m37NSRF',
    campaignId: 'CMaVCUKcxf2qHNhvcnLUEmpXWs9aZWB4xp5nYACj6a2g',
  },

  /**
   * Staging configurations
   */
  testnet: {
    node: 'https://api.testnet.solana.com',
    programId: '2L1eKz8TA88j84yoAywGdeKF1ohvjQC4iMxzR5GbjkWD',
    campaignId: 'CMaVCUKcxf2qHNhvcnLUEmpXWs9aZWB4xp5nYACj6a2g',
  },

  /**
   * Production configurations
   */
  mainnet: {
    node: 'https://api.mainnet-beta.solana.com',
    programId: '2L1eKz8TA88j84yoAywGdeKF1ohvjQC4iMxzR5GbjkWD',
    campaignId: 'CMaVCUKcxf2qHNhvcnLUEmpXWs9aZWB4xp5nYACj6a2g',
  },
}

/**
 * Module exports
 */
export default conf
