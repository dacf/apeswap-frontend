/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { PoolConfig } from 'config/constants/types'
import {
  fetchPoolsAllowance,
  fetchUserBalances,
  fetchUserStakeBalances,
  fetchUserPendingRewards,
} from './fetchPoolsUser'
import { PoolsState, Pool, TokenPrices, AppThunk } from '../types'
import fetchPools from './fetchPools'
import fetchPoolsConfigFromApi from './fetchPoolsConfig'

const initialState: PoolsState = {
  data: [],
}

export const PoolsSlice = createSlice({
  name: 'Pools',
  initialState,
  reducers: {
    setPoolsConfig: (state, action) => {
      state.data = [...action.payload]
    },
    setPoolsPublicData: (state, action) => {
      const livePoolsData: Pool[] = action.payload
      state.data = state.data.map((pool) => {
        const livePoolData = livePoolsData.find((entry) => entry.sousId === pool.sousId)
        console.log('livePoolsData:::', { ...pool, ...livePoolData })
        return { ...pool, ...livePoolData }
      })
    },
    setPoolsUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((pool) => {
        const userPoolData = userData.find((entry) => entry.sousId === pool.sousId)
        return { ...pool, userData: userPoolData }
      })
    },
    updatePoolsUserData: (state, action) => {
      const { field, value, sousId } = action.payload
      const index = state.data.findIndex((p) => p.sousId === sousId)
      state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
    },
  },
})

// Actions
export const { setPoolsPublicData, setPoolsUserData, updatePoolsUserData, setPoolsConfig } = PoolsSlice.actions

// Thunks
export const updatePoolsConfig = () => async (dispatch) => {
  try {
    const livePoolsConfig = await fetchPoolsConfigFromApi()
    console.log('livePoolsConfigInReducer:::', livePoolsConfig)
    dispatch(setPoolsConfig(livePoolsConfig))
  } catch (error) {
    console.warn(error)
  }
}

export const fetchPoolsPublicDataAsync =
  (poolsConfig: PoolConfig[], chainId: number, tokenPrices: TokenPrices[]): AppThunk =>
  async (dispatch) => {
    try {
      console.log('poolsConfig:::', poolsConfig)
      const pools = await fetchPools(poolsConfig, chainId, tokenPrices)
      console.log('poolsInReducer::::', pools)
      dispatch(setPoolsPublicData(pools))
    } catch (error) {
      console.warn(error)
    }
  }

export const fetchPoolsUserDataAsync =
  (poolsConfig: PoolConfig[], chainId: number, account): AppThunk =>
  async (dispatch) => {
    try {
      console.log('fetchPoolsUserDataAsync-:::', poolsConfig)
      const allowances = await fetchPoolsAllowance(poolsConfig, chainId, account)
      const stakingTokenBalances = await fetchUserBalances(poolsConfig, chainId, account)
      const stakedBalances = await fetchUserStakeBalances(poolsConfig, chainId, account)
      const pendingRewards = await fetchUserPendingRewards(poolsConfig, chainId, account)

      const userData = poolsConfig.map((pool) => ({
        sousId: pool.sousId,
        allowance: allowances[pool.sousId],
        stakingTokenBalance: stakingTokenBalances[pool.sousId],
        stakedBalance: stakedBalances[pool.sousId],
        pendingReward: pendingRewards[pool.sousId],
      }))
      dispatch(setPoolsUserData(userData))
    } catch (error) {
      console.warn(error)
    }
  }

export const updateUserAllowance =
  (poolsConfig: PoolConfig[], chainId: number, sousId: number, account: string): AppThunk =>
  async (dispatch) => {
    console.log('updateUserAllowance-:::', poolsConfig)
    const allowances = await fetchPoolsAllowance(poolsConfig, chainId, account)
    dispatch(updatePoolsUserData({ sousId, field: 'allowance', value: allowances[sousId] }))
  }

export const updateUserBalance =
  (poolsConfig: PoolConfig[], chainId: number, sousId: number, account: string): AppThunk =>
  async (dispatch) => {
    console.log('updateUserBalance-:::', poolsConfig)
    const tokenBalances = await fetchUserBalances(poolsConfig, chainId, account)
    dispatch(updatePoolsUserData({ sousId, field: 'stakingTokenBalance', value: tokenBalances[sousId] }))
  }

export const updateUserStakedBalance =
  (poolsConfig: PoolConfig[], chainId: number, sousId: number, account: string): AppThunk =>
  async (dispatch) => {
    console.log('updateUserStakedBalance-:::', poolsConfig)
    const stakedBalances = await fetchUserStakeBalances(poolsConfig, chainId, account)
    dispatch(updatePoolsUserData({ sousId, field: 'stakedBalance', value: stakedBalances[sousId] }))
  }

export const updateUserPendingReward =
  (poolsConfig: PoolConfig[], chainId: number, sousId: number, account: string): AppThunk =>
  async (dispatch) => {
    console.log('updateUserPendingReward-:::', poolsConfig)
    const pendingRewards = await fetchUserPendingRewards(poolsConfig, chainId, account)
    dispatch(updatePoolsUserData({ sousId, field: 'pendingReward', value: pendingRewards[sousId] }))
  }

export default PoolsSlice.reducer
