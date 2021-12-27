import BigNumber from 'bignumber.js'
import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
// import masterChefABI from 'config/abi/masterchef.json'
import masterChefABI from 'config/abi/metaRewards.json'
import cakeABI from 'config/abi/cake.json'
import wbnbABI from 'config/abi/weth.json'
import multicall from 'utils/multicall'
import { getAddress } from 'utils/addressHelpers'
import { BIG_TEN, BIG_ZERO } from 'utils/bigNumber'
import { getSouschefV2Contract, getMasterchefContract } from 'utils/contractHelpers'
import tokens from 'config/constants/tokens'
// import { getMasterchefContract } from 'utils/contractHelpers'

const masterChefContract = getMasterchefContract()

export const fetchPoolsBlockLimits = async () => {
  const poolsWithEnd = poolsConfig.filter((p) => p.sousId !== 0)
  const callsStartBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'startBlock',
    }
  })
  const callsEndBlock = poolsWithEnd.map((poolConfig) => {
    return {
      address: getAddress(poolConfig.contractAddress),
      name: 'bonusEndBlock',
    }
  })
  const starts = await masterChefContract.startBlock
  const ends = await masterChefContract.endBlock

  // const starts = await multicall(sousChefABI, callsStartBlock)
  // const ends = await multicall(sousChefABI, callsEndBlock)

  return poolsWithEnd.map((cakePoolConfig, index) => {
    const startBlock = starts[index]
    const endBlock = ends[index]
    return {
      sousId: cakePoolConfig.sousId,
      startBlock: new BigNumber(startBlock).toJSON(),
      endBlock: new BigNumber(endBlock).toJSON(),
    }
  })
}

export const fetchPoolsTotalStaking = async () => {
  const nonBnbPools = poolsConfig.filter((p) => p.stakingToken.symbol !== 'BNB')
  // pools: 3, 

  // const bnbPool = poolsConfig.filter((p) => p.stakingToken.symbol === 'BNB')

  // const callsNonBnbPools = nonBnbPools.map((poolConfig) => {
  //   return {
  //     address: poolConfig.stakingToken.address,
  //     name: 'balanceOf',
  //     params: [getAddress(poolConfig.contractAddress)],
  //   }
  // })

  const callsPoolInfo = [
    {
      address: getAddress(nonBnbPools[0].contractAddress),
      name: 'totalAllocPoint',
    },
    {
      address: getAddress(nonBnbPools[0].contractAddress),
      name: 'tokenPerBlock',
    }
  ]

  const [totalAllocPoint, tokenPerBlock] = await multicall(masterChefABI, callsPoolInfo)
  console.log("zzzzzzzzzzzzzzzz", tokenPerBlock)
  // mrt / mrt pool
  const nonBnbPoolsTotalStaked = [];
  const allocPoint = [];

  const forCallData = poolsConfig.filter((p) => p.stakingToken.symbol !== 'BNB')
  const calls = forCallData.map((pool) => {
    return {
      address: getAddress(pool.contractAddress),
      name: 'poolInfo',
      params: [pool.sousId],
    }
  })

  const rawPoolInfos = await multicall(masterChefABI, calls)

  /*
  const poolInfo0 = await masterChefContract.poolInfo(poolsConfig[0].sousId)
  const allocPoint0 = poolInfo0.allocPoint.toString()
  allocPoint.push(allocPoint0)
  nonBnbPoolsTotalStaked.push(poolInfo0.balance.toString());

  const poolInfo1 = await masterChefContract.poolInfo(poolsConfig[1].sousId)
  const allocPoint1 = poolInfo1.allocPoint.toString()
  allocPoint.push(allocPoint1)
  nonBnbPoolsTotalStaked.push(poolInfo1.balance.toString());

  const poolInfo2 = await masterChefContract.poolInfo(poolsConfig[2].sousId)
  const allocPoint2 = poolInfo2.allocPoint.toString()
  allocPoint.push(allocPoint2)
  nonBnbPoolsTotalStaked.push(poolInfo2.balance.toString());
  */

  // const nonBnbPoolsTotalStaked = nonBnbPools.map((poolConfig) => {
  //   let poolInfo = await masterChefContract.poolInfo(poolConfig.sousId)
  //   return poolInfo.balance.toString();
  // })

  // const nonBnbPoolsTotalStaked = await multicall(cakeABI, callsNonBnbPools)

  return [
    ...nonBnbPools.map((p, index) => ({
      sousId: p.sousId,
      totalStaked: rawPoolInfos[index].balance.toString(),
      rate: new BigNumber(rawPoolInfos[index].allocPoint.toString()).div(new BigNumber(totalAllocPoint[0].toString())),
      tokenPerBlock: new BigNumber(tokenPerBlock[0].toString()).div(BIG_TEN.pow(18)),
      harvestInterval: rawPoolInfos[index].harvestInterval.toString()
    })),
  ]
}

export const fetchPoolStakingLimit = async (sousId: number): Promise<BigNumber> => {
  try {
    const sousContract = getSouschefV2Contract(sousId)
    const stakingLimit = await sousContract.poolLimitPerUser()
    return new BigNumber(stakingLimit.toString())
  } catch (error) {
    return BIG_ZERO
  }
}

export const fetchPoolsStakingLimits = async (
  poolsWithStakingLimit: number[],
): Promise<{ [key: string]: BigNumber }> => {
  const validPools = poolsConfig
    .filter((p) => p.stakingToken.symbol !== 'BNB' && !p.isFinished)
    .filter((p) => !poolsWithStakingLimit.includes(p.sousId))

  // Get the staking limit for each valid pool
  // Note: We cannot batch the calls via multicall because V1 pools do not have "poolLimitPerUser" and will throw an error
  const stakingLimitPromises = validPools.map((validPool) => fetchPoolStakingLimit(validPool.sousId))
  const stakingLimits = await Promise.all(stakingLimitPromises)

  return stakingLimits.reduce((accum, stakingLimit, index) => {
    return {
      ...accum,
      [validPools[index].sousId]: stakingLimit,
    }
  }, {})
}
