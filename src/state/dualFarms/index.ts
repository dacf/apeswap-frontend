/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { dualFarmsConfig } from 'config/constants'
import BigNumber from 'bignumber.js'
import { DualFarmConfig } from 'config/constants/types'
import fetchDualFarms from './fetchDualFarms'
import {
  fetchDualMiniChefEarnings,
  fetchDualFarmUserAllowances,
  fetchDualFarmUserTokenBalances,
  fetchDualFarmUserStakedBalances,
  fetchDualFarmRewarderEarnings,
} from './fetchDualFarmUser'
import { TokenPrices, DualFarm, DualFarmsState, FarmLpAprsType } from '../types'
import fetchFarmConfigFromApi from './fetchDualFarmsConfig'

const initialState: DualFarmsState = {
  data: [],
}

export const dualFarmsSlice = createSlice({
  name: 'dualFarms',
  initialState,
  reducers: {
    setFarmsConfig: (state, action) => {
      state.data = [...action.payload]
    },
    setDualFarmsPublicData: (state, action) => {
      const liveFarmsData: DualFarm[] = action.payload
      state.data = state.data.map((farm) => {
        const liveFarmData = liveFarmsData.find((f) => f.pid === farm.pid)
        console.log('liveFarmData:::', { ...farm, liveFarmData })
        return { ...farm, ...liveFarmData }
      })
    },
    setDualFarmUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((dualFarm) => {
        const userDualFarmData = userData.find((entry) => entry.pid === dualFarm.pid)
        return { ...dualFarm, userData: userDualFarmData }
      })
    },
    updateDualFarmUserData: (state, action) => {
      const { field, value, pid } = action.payload
      const index = state.data.findIndex((p) => p.pid === pid)
      state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
    },
  },
})

// Actions
export const { setDualFarmsPublicData, setDualFarmUserData, updateDualFarmUserData, setFarmsConfig } =
  dualFarmsSlice.actions

// Thunks
export const updateFarmsConfig = () => async (dispatch) => {
  try {
    const liveFarmsConfig = await fetchFarmConfigFromApi()
    console.log('liveDualFarmsConfigInReducer:::', liveFarmsConfig)
    dispatch(setFarmsConfig(liveFarmsConfig))
  } catch (error) {
    console.warn(error)
  }
}

export const fetchDualFarmsPublicDataAsync =
  (
    dFConfig: DualFarmConfig[],
    chainId: number,
    tokenPrices: TokenPrices[],
    bananaPrice: BigNumber,
    farmLpAprs: FarmLpAprsType,
  ) =>
  async (dispatch) => {
    try {
      console.log('dFConfig:::', dFConfig)
      const dualFarms = await fetchDualFarms(dFConfig, chainId, tokenPrices, bananaPrice, farmLpAprs)
      console.log('dualFarmsInReducer::::', dualFarms)
      dispatch(setDualFarmsPublicData(dualFarms))
    } catch (error) {
      console.warn(error)
    }
  }

export const fetchDualFarmUserDataAsync = (dualFarms, chainId: number, account: string) => async (dispatch) => {
  try {
    console.log('fetchDualFarmUserDataAsync-dualFarms:::', dualFarms)
    const userFarmAllowances = await fetchDualFarmUserAllowances(chainId, account)
    const userFarmTokenBalances = await fetchDualFarmUserTokenBalances(chainId, account)
    const userStakedBalances = await fetchDualFarmUserStakedBalances(chainId, account)
    const miniChefEarnings = await fetchDualMiniChefEarnings(chainId, account)
    const rewarderEarnings = await fetchDualFarmRewarderEarnings(chainId, account)
    const arrayOfUserDataObjects = dualFarms.map((dualFarm) => {
      return {
        pid: dualFarm.pid,
        allowance: userFarmAllowances[dualFarm.pid],
        tokenBalance: userFarmTokenBalances[dualFarm.pid],
        stakedBalance: userStakedBalances[dualFarm.pid],
        miniChefEarnings: miniChefEarnings[dualFarm.pid],
        rewarderEarnings: rewarderEarnings[dualFarm.pid],
      }
    })
    dispatch(setDualFarmUserData(arrayOfUserDataObjects))
  } catch (error) {
    console.warn(error)
  }
}

export const updateDualFarmUserAllowances = (dualFarms, chainId: number, pid, account: string) => async (dispatch) => {
  console.log('updateDualFarmUserAllowances-dualFarms:::', dualFarms)
  const allowances = await fetchDualFarmUserAllowances(chainId, account)
  const pidIndex = dualFarms.findIndex((f) => f.pid === pid)
  dispatch(updateDualFarmUserData({ pid, field: 'allowance', value: allowances[pidIndex] }))
}

export const updateDualFarmUserTokenBalances =
  (dualFarms, chainId: number, pid, account: string) => async (dispatch) => {
    console.log('updateDualFarmUserTokenBalances-dualFarms:::', dualFarms)
    const tokenBalances = await fetchDualFarmUserTokenBalances(chainId, account)
    const pidIndex = dualFarms.findIndex((f) => f.pid === pid)
    dispatch(updateDualFarmUserData({ pid, field: 'tokenBalance', value: tokenBalances[pidIndex] }))
  }

export const updateDualFarmUserStakedBalances =
  (dualFarms, chainId: number, pid, account: string) => async (dispatch) => {
    console.log('updateDualFarmUserStakedBalances-dualFarms:::', dualFarms)
    const stakedBalances = await fetchDualFarmUserStakedBalances(chainId, account)
    const pidIndex = dualFarms.findIndex((f) => f.pid === pid)
    dispatch(updateDualFarmUserData({ pid, field: 'stakedBalance', value: stakedBalances[pidIndex] }))
  }

export const updateDualFarmUserEarnings = (dualFarms, chainId: number, pid, account: string) => async (dispatch) => {
  console.log('updateDualFarmUserEarnings-dualFarms:::', dualFarms)
  const pendingRewards = await fetchDualMiniChefEarnings(chainId, account)
  const pidIndex = dualFarms.findIndex((f) => f.pid === pid)
  dispatch(updateDualFarmUserData({ pid, field: 'miniChefEarnings', value: pendingRewards[pidIndex] }))
}

export const updateDualFarmRewarderEarnings =
  (dualFarms, chainId: number, pid, account: string) => async (dispatch) => {
    console.log('updateDualFarmRewarderEarnings-dualFarms:::', dualFarms)
    const rewarderEarnings = await fetchDualFarmRewarderEarnings(chainId, account)
    const pidIndex = dualFarms.findIndex((f) => f.pid === pid)
    dispatch(updateDualFarmUserData({ pid, field: 'rewarderEarnings', value: rewarderEarnings[pidIndex] }))
  }

export default dualFarmsSlice.reducer
