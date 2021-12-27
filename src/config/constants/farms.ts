import { serializeTokens } from './tokens'
import { SerializedFarmConfig } from './types'

const serializedTokens = serializeTokens()

const farms: SerializedFarmConfig[] = [
  /**
   * These 3 farms (PID 0, 251, 252) should always be at the top of the file.
   */
  {
    pid: 6,
    lpSymbol: 'BUSD-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x58F876857a02D6762E0101bb5C46A8c1ED44Dc16',
    },
    token: serializedTokens.busd,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 0,
    lpSymbol: 'MRT-BNB LP',
    lpAddresses: {
      97: '0x3ed8936cAFDF85cfDBa29Fbe5940A5b0524824F4',
      56: '0x5ec2ec1C9d2e6DEba58536c5Ecbe2E955CC4c227',
    },
    token: serializedTokens.mrt,
    quoteToken: serializedTokens.wbnb,
  },
  {
    pid: 1,
    lpSymbol: 'MRT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x5ec2ec1C9d2e6DEba58536c5Ecbe2E955CC4c227',
    },
    token: serializedTokens.mrt,
    quoteToken: serializedTokens.wbnb,
  },

  {
    pid: 2,
    lpSymbol: 'MRT-BNB LP',
    lpAddresses: {
      97: '',
      56: '0x5ec2ec1C9d2e6DEba58536c5Ecbe2E955CC4c227',
    },
    token: serializedTokens.mrt,
    quoteToken: serializedTokens.wbnb,
  },

]

export default farms
