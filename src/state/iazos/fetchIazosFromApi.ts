import axiosRetry from 'axios-retry'
import axios from 'axios'
import { apiBaseUrl } from 'hooks/api'
import { IazoSocialInfo, IazoFeeInfo, IazoTimeInfo, IazoStatus, Iazo, IazoTokenInfo } from 'state/types'

const getIazosFromApi = async (chainId: number) => {
  const apiUrl = chainId === 97 ? 'https://apeswap-api-development.herokuapp.com' : apiBaseUrl
  try {
    axiosRetry(axios, {
      retries: 3,
      retryCondition: () => true,
      retryDelay: () => 10000,
    })
    const statRes = await axios.get(`${apiUrl}/iazo`)
    if (statRes.status === 500) return null
    return statRes.data
  } catch (error) {
    console.error(error)
    return null
  }
}

const getIazoFromApi = async (chainId: number, address: string) => {
  const apiUrl = chainId === 97 ? 'https://apeswap-api-development.herokuapp.com' : apiBaseUrl
  try {
    axiosRetry(axios, {
      retries: 3,
      retryCondition: () => true,
      retryDelay: () => 10000,
    })
    const statRes = await axios.get(`${apiUrl}/iazo/${address}`)
    if (statRes.status === 500) return null
    return statRes.data
  } catch (error) {
    console.error(error)
    return null
  }
}

const formatIazoData = (iazo): Iazo => {
  const iazoSocialInfo: IazoSocialInfo = {
    twitter: iazo.twitter,
    telegram: iazo.telegram,
    medium: iazo.medium,
    whitepaper: iazo.whitepaper,
    website: iazo.website,
    description: iazo.description,
    tokenImage: iazo.pathImage,
  }

  const timeInfo: IazoTimeInfo = {
    startTime: iazo.startDate,
    activeTime: iazo.duration,
    lockPeriod: iazo.lockTime,
  }

  const feeInfo: IazoFeeInfo = {
    feeAddress: null,
    baseFee: null,
    iazoTokenFee: null,
  }

  const status: IazoStatus = {
    lpGenerationComplete: null,
    forceFailed: null,
    totalBaseCollected: null,
    totalTokensSold: null,
    totalTokensWithdraw: null,
    totalBaseWithdraw: null,
    numBuyers: null,
  }

  const baseToken: IazoTokenInfo = {
    address: iazo.token2,
    name: null,
    symbol: null,
    decimals: null,
  }

  const iazoToken: IazoTokenInfo = {
    address: iazo.token1,
    name: null,
    symbol: null,
    decimals: null,
    totalSupply: null,
  }

  return {
    iazoContractAddress: iazo.iazoAddress,
    iazoOwnerAddress: iazo.owner,
    tokenPrice: iazo.pricePresale,
    amount: iazo.totalPresale,
    hardcap: iazo.hardcap,
    softcap: iazo.softcap,
    maxSpendPerBuyer: iazo.limitDefault,
    liquidityPercent: iazo.percentageLock,
    listingPrice: iazo.priceListing,
    burnRemain: iazo.burnRemaining,
    iazoTags: iazo.tags,
    iazoState: null,
    feeInfo,
    timeInfo,
    status,
    baseToken,
    iazoToken,
    socialInfo: iazoSocialInfo,
  }
}
const fetchIazosFromApi = async (chainId: number): Promise<Iazo[]> => {
  const iazos = await getIazosFromApi(chainId)

  const formattedIazos = iazos.map((iazo) => {
    return formatIazoData(iazo)
  })
  return formattedIazos
}

export const fetchIazoFromApi = async (chainId: number, address: string): Promise<Iazo[]> => {
  const iazos = await getIazoFromApi(chainId, address)
  const formattedIazos = iazos.map((iazo) => {
    return formatIazoData(iazo)
  })
  return formattedIazos
}

export default fetchIazosFromApi
