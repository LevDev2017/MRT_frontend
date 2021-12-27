import poolsConfig from 'config/constants/pools'
import sousChefABI from 'config/abi/sousChef.json'
// import masterChefABI from 'config/abi/masterchef.json'
import masterChefABI from 'config/abi/metaRewards.json'
import erc20ABI from 'config/abi/erc20.json'
import multicall from 'utils/multicall'
import { getMasterchefContract } from 'utils/contractHelpers'
import { getAddress } from 'utils/addressHelpers'
import { simpleRpcProvider } from 'utils/providers'
import BigNumber from 'bignumber.js'
import { BIG_ZERO } from 'utils/bigNumber'

// Pool 0, Cake / Cake is a different kind of contract (master chef)
// BNB pools use the native BNB token (wrapping ? unwrapping is done at the contract level)
const nonBnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol !== 'BNB')
const bnbPools = poolsConfig.filter((pool) => pool.stakingToken.symbol === 'BNB')
const nonMasterPools = poolsConfig.filter((pool) => pool.sousId !== 6)
const masterChefContract = getMasterchefContract()

export const fetchPoolsAllowance = async (account) => {
  const calls = nonBnbPools.map((pool) => ({
    address: pool.stakingToken.address,
    name: 'allowance',
    params: [account, getAddress(pool.contractAddress)],
  }))

  const allowances = await multicall(erc20ABI, calls)
  return nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(allowances[index]).toJSON() }),
    {},
  )
}

export const fetchUserBalances = async (account) => {
  // Non BNB pools
  const calls = nonBnbPools.map((pool) => ({
    address: pool.stakingToken.address,
    name: 'balanceOf',
    params: [account],
  }))
  const tokenBalancesRaw = await multicall(erc20ABI, calls)
  const tokenBalances = nonBnbPools.reduce(
    (acc, pool, index) => ({ ...acc, [pool.sousId]: new BigNumber(tokenBalancesRaw[index]).toJSON() }),
    {},
  )

  // BNB pools
  const bnbBalance = await simpleRpcProvider.getBalance(account)
  const bnbBalances = bnbPools.reduce(
    (acc, pool) => ({ ...acc, [pool.sousId]: new BigNumber(bnbBalance.toString()).toJSON() }),
    {},
  )

  return { ...tokenBalances, ...bnbBalances }
}

export const fetchUserStakeBalances = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'userInfo',
    params: [p.sousId, account],
  }))
  const userInfo = await multicall(masterChefABI, calls)
  const stakedBalances = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(userInfo[index].amount._hex).toJSON(),
    }),
    {},
  )

  // Cake / Cake pool
  // const { amount: masterPoolAmount } = await masterChefContract.userInfo('0', account)

  // return { ...stakedBalances, 0: new BigNumber(masterPoolAmount.toString()).toJSON() }
  return { ...stakedBalances }
}

export const fetchUserPendingRewards = async (account) => {
  // const calls = nonMasterPools.map((p) => ({
  //   address: getAddress(p.contractAddress),
  //   name: 'pendingToken',
  //   params: [p.sousId, account],
  // }))

  // mrt / mrt pool
  const res = [];
  const pendingToken3 = await masterChefContract.pendingToken('3', account)
  res.push(pendingToken3.toString());
  const pendingToken4 = await masterChefContract.pendingToken('4', account)
  res.push(pendingToken4.toString());
  const pendingToken5 = await masterChefContract.pendingToken('5', account)
  res.push(pendingToken5.toString());

  // const res = await multicall(masterChefABI, calls)
  const pendingRewards = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: new BigNumber(res[index]).toJSON(),
    }),
    {},
  )
  
  // return { ...pendingRewards, 0: new BigNumber(pendingReward.toString()).toJSON() }
  return { ...pendingRewards }
}

export const fetchUserLastDepositTimes = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'userInfo',
    params: [p.sousId, account],
  }))
  const userInfos = await multicall(masterChefABI, calls)
  const lastDepositTimes = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: userInfos[index].lastDepositTime ? new BigNumber(userInfos[index].lastDepositTime._hex).toJSON() : BIG_ZERO,
    }),
    {},
  )

  return { ...lastDepositTimes }
}

export const fetchUserCanHarvests = async (account) => {
  const calls = nonMasterPools.map((p) => ({
    address: getAddress(p.contractAddress),
    name: 'canHarvest',
    params: [p.sousId, account],
  }))
  const rawCanHarvests = await multicall(masterChefABI, calls)
  const resCanHarvests = nonMasterPools.reduce(
    (acc, pool, index) => ({
      ...acc,
      [pool.sousId]: rawCanHarvests[index][0]
    }),
    {},
  )

  return { ...resCanHarvests }
}