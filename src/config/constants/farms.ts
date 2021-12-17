import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  {
    pid: 0,
    lpSymbol: 'CAKE',
    lpAddresses: {
      97: '0x9C21123D94b93361a29B2C2EFB3d5CD8B17e0A9e',
      56: '0x0e09fabb73bd3ade0a17ecc321fd13a19e81ce82',
    },
    token: serializedTokens.syrup,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 251,
    lpSymbol: 'MRT-BNB LP',
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0xb15f39d979208F05474CF4B8f66Fd46f6f4A77f3',
    },
    token: serializedTokens.mrt,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 252,
    lpSymbol: 'MRT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xb15f39d979208F05474CF4B8f66Fd46f6f4A77f3',
    },
    token: serializedTokens.mrt,
    quoteToken: serializedTokens.wbnb,
  },

  {
    pid: 480,
    lpSymbol: 'MRT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0xb15f39d979208F05474CF4B8f66Fd46f6f4A77f3',
    },
    token: serializedTokens.mrt,
    quoteToken: serializedTokens.wbnb,
  },
  
]

export default farms
