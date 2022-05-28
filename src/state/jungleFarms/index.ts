/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit'
import { JungleFarmConfig } from 'config/constants/types'
import {
  fetchJungleFarmsAllowance,
  fetchUserBalances,
  fetchUserStakeBalances,
  fetchUserPendingRewards,
} from './fetchJungleFarmUser'
import { JungleFarmsState, JungleFarm, TokenPrices, AppThunk } from '../types'
import fetchJungleFarms from './fetchJungleFarms'
import fetchJungleFarmConfigFromApi from './fetchJungleFarmsConfig'

const initialState: JungleFarmsState = { data: [] }

export const JungleFarmsSlice = createSlice({
  name: 'JungleFarms',
  initialState,
  reducers: {
    setJungleFarmsConfig: (state, action) => {
      state.data = action.payload
    },
    setJungleFarmsPublicData: (state, action) => {
      const liveJungleFarmsData: JungleFarm[] = action.payload
      state.data = state.data.map((farm) => {
        const liveFarmData = liveJungleFarmsData.find((entry) => entry.jungleId === farm.jungleId)
        return { ...farm, ...liveFarmData }
      })
    },
    setJungleFarmsUserData: (state, action) => {
      const userData = action.payload
      state.data = state.data.map((farm) => {
        const userFarmData = userData.find((entry) => entry.jungleId === farm.jungleId)
        return { ...farm, userData: userFarmData }
      })
    },
    updateJungleFarmsUserData: (state, action) => {
      const { field, value, jungleId } = action.payload
      const index = state.data.findIndex((p) => p.jungleId === jungleId)
      state.data[index] = { ...state.data[index], userData: { ...state.data[index].userData, [field]: value } }
    },
  },
})

// Actions
export const { setJungleFarmsPublicData, setJungleFarmsUserData, updateJungleFarmsUserData, setJungleFarmsConfig } =
  JungleFarmsSlice.actions

// Thunks
export const updateJungleFarmsConfig = () => async (dispatch) => {
  try {
    const liveJungleFarmsConfig = await fetchJungleFarmConfigFromApi()
    dispatch(setJungleFarmsConfig(liveJungleFarmsConfig))
  } catch (error) {
    console.warn(error)
  }
}

export const fetchJungleFarmsPublicDataAsync =
  (jungleFarmsConfig: JungleFarmConfig[], chainId: number, tokenPrices: TokenPrices[]): AppThunk =>
  async (dispatch) => {
    try {
      const farms = await fetchJungleFarms(jungleFarmsConfig, chainId, tokenPrices)
      dispatch(setJungleFarmsPublicData(farms))
    } catch (error) {
      console.warn(error)
    }
  }

export const fetchJungleFarmsUserDataAsync =
  (jungleFarmsConfig: JungleFarmConfig[], chainId: number, account): AppThunk =>
  async (dispatch) => {
    try {
      const allowances = await fetchJungleFarmsAllowance(jungleFarmsConfig, chainId, account)
      const stakingTokenBalances = await fetchUserBalances(jungleFarmsConfig, chainId, account)
      const stakedBalances = await fetchUserStakeBalances(jungleFarmsConfig, chainId, account)
      const pendingRewards = await fetchUserPendingRewards(jungleFarmsConfig, chainId, account)

      const userData = jungleFarmsConfig.map((farm) => ({
        jungleId: farm.jungleId,
        allowance: allowances[farm.jungleId],
        stakingTokenBalance: stakingTokenBalances[farm.jungleId],
        stakedBalance: stakedBalances[farm.jungleId],
        pendingReward: pendingRewards[farm.jungleId],
      }))
      dispatch(setJungleFarmsUserData(userData))
    } catch (error) {
      console.warn(error)
    }
  }

export const updateJungleFarmsUserAllowance =
  (jungleFarmsConfig: JungleFarmConfig[], chainId: number, jungleId: number, account: string): AppThunk =>
  async (dispatch) => {
    const allowances = await fetchJungleFarmsAllowance(jungleFarmsConfig, chainId, account)
    dispatch(updateJungleFarmsUserData({ jungleId, field: 'allowance', value: allowances[jungleId] }))
  }

export const updateJungleFarmsUserBalance =
  (jungleFarmsConfig: JungleFarmConfig[], chainId: number, jungleId: number, account: string): AppThunk =>
  async (dispatch) => {
    const tokenBalances = await fetchUserBalances(jungleFarmsConfig, chainId, account)
    dispatch(updateJungleFarmsUserData({ jungleId, field: 'stakingTokenBalance', value: tokenBalances[jungleId] }))
  }

export const updateJungleFarmsUserStakedBalance =
  (jungleFarmsConfig: JungleFarmConfig[], chainId: number, jungleId: number, account: string): AppThunk =>
  async (dispatch) => {
    const stakedBalances = await fetchUserStakeBalances(jungleFarmsConfig, chainId, account)
    dispatch(updateJungleFarmsUserData({ jungleId, field: 'stakedBalance', value: stakedBalances[jungleId] }))
  }

export const updateJungleFarmsUserPendingReward =
  (jungleFarmsConfig: JungleFarmConfig[], chainId: number, jungleId: number, account: string): AppThunk =>
  async (dispatch) => {
    const pendingRewards = await fetchUserPendingRewards(jungleFarmsConfig, chainId, account)
    dispatch(updateJungleFarmsUserData({ jungleId, field: 'pendingReward', value: pendingRewards[jungleId] }))
  }

export default JungleFarmsSlice.reducer
