import { RouterTypes } from 'config/constants'
import { WALLCHAIN_PARAMS } from 'config/constants/chains'
import { BigNumberish, BytesLike, Contract, constants } from 'ethers'
import { SwapDelay, RouterTypeParams } from 'state/swap/actions'
/**
 * The ApeRouterManager ABI is important for decoding the return data from the Wallchain API.
 * If there is trouble decoding the data, check for a new ABI.
 */
import { ApeRouterManager } from '../config/abi/types/ApeRouterManager'
import ApeRouterManagerABI from '../config/abi/apeRouterManager.json'

/**
 * Configure whitelisted bonus router functions.
 *
 * The data that is brought back from the API will attempt to be decoded by these functions.
 * If the data cannot be decoded from the allowed functions then the validation SHOULD fail.
 *
 * This is important to protect against a compromised API
 */
export const ALLOWED_BONUS_ROUTER_FUNCTIONS = <const>[
  'swapExactTokensForTokens',
  'swapTokensForExactTokens',
  'swapExactETHForTokens',
  'swapTokensForExactETH',
  'swapExactTokensForETH',
  'swapETHForExactTokens',
]
export type ALLOWED_BONUS_ROUTER_FUNCTIONS_TYPE = typeof ALLOWED_BONUS_ROUTER_FUNCTIONS[number]

interface RouterFunctionParams {
  amountInMax?: BigNumberish
  amountIn?: BigNumberish
  amountOut?: BigNumberish
  amountOutMin?: BigNumberish
  path: string[]
  to: string
  deadline: BigNumberish
  router: string
  masterInput: BytesLike
}

export function decodeRouterFunctionData(
  routerContract: ApeRouterManager,
  data: string,
): {
  functionName: ALLOWED_BONUS_ROUTER_FUNCTIONS_TYPE | undefined
  functionParams: RouterFunctionParams | undefined
} {
  let functionName
  let functionParams
  // eslint-disable-next-line no-restricted-syntax
  for (const allowedFunctionName of ALLOWED_BONUS_ROUTER_FUNCTIONS) {
    try {
      functionParams = routerContract.interface.decodeFunctionData(allowedFunctionName, data)
      functionName = allowedFunctionName
      break
    } catch (e) {
      // Expecting errors when brute forcing function names
    }
  }
  return { functionName, functionParams }
}

/**
 *
 * @param dataResponse
 * @param value
 * @param account
 * @param contractAddress
 * @returns
 */
const wallchainResponseIsValid = (
  dataResponse: WallchainDataResponse,
  chainId: number,
  methodName: ALLOWED_BONUS_ROUTER_FUNCTIONS_TYPE,
  args: (string | string[])[],
  value: string,
  account: string,
  contractAddress: string,
) => {
  if (!dataResponse.pathFound) {
    // Opportunity was not found -> response should be ignored -> valid.
    return false
    // NOTE: not considered a validation error, just no opportunities exist
  }
  const apeRouterManager = new Contract(constants.AddressZero, ApeRouterManagerABI) as ApeRouterManager
  const { functionName, functionParams } = decodeRouterFunctionData(apeRouterManager, dataResponse.transactionArgs.data)

  // NOTE: Can validate additional params based on args passed
  const validationErrors = []
  if (!functionName || !functionParams) {
    validationErrors.push(`error decoding functionName/functionParams`)
  } else if (functionName !== methodName) {
    validationErrors.push(
      `functionName passed to API differs from functionName returned from API: ${methodName} vs ${functionName} returned`,
    )
  }

  // NOTE: Args are passed in an array and differs by 1 length depending on it the function is payable or not
  // We are able to find the arg of choice by working backwards from the length
  const ARGS_LENGTH = 5
  const ARGS_PATH_INDEX = ARGS_LENGTH - 3
  if (functionParams.path.toString() !== args[ARGS_PATH_INDEX].toString()) {
    validationErrors.push(
      `functionParams.path ${functionParams.path} does not equal args[${ARGS_PATH_INDEX}] ${args[ARGS_PATH_INDEX]}`,
    )
  }

  if (functionParams.to.toLowerCase() !== account.toLowerCase()) {
    validationErrors.push(`functionParams.to ${functionParams.to} does not equal account ${account}`)
  }

  if (dataResponse.transactionArgs.sender.toLowerCase() !== account.toLowerCase()) {
    validationErrors.push(
      `transactionArgs.sender ${dataResponse.transactionArgs.sender} does not equal account ${account}`,
    )
  }

  if (dataResponse.transactionArgs.destination.toLowerCase() !== contractAddress.toLowerCase()) {
    validationErrors.push(
      `transactionArgs.destination ${dataResponse.transactionArgs.destination} does not equal contractAddress ${contractAddress}`,
    )
  }

  if (dataResponse.transactionArgs.value.toLowerCase() !== value.toLowerCase()) {
    validationErrors.push(`transactionArgs.value ${dataResponse.transactionArgs.value} does not equal value ${value}`)
  }

  if (validationErrors.length) {
    recordTransactionError(validationErrors, dataResponse, chainId)
    return false
  }
  return true
}

export type WallchainDataResponse = {
  pathFound: boolean
  summary?: {
    searchSummary?: {
      expectedKickbackProfit?: number
      expectedProfit?: number
      expectedUsdProfit?: number
      firstTokenAddress?: string
      firstTokenAmount?: number
    }
  }
  transactionArgs: {
    data: string
    destination: string
    sender: string
    value: string
    masterInput: string
  }
}

/**
 * Call Wallchain API to analyze the expected opportunity.
 * @param methodName function to execute in transaction
 * @param args arguments for the function
 * @param value value parameter for the transaction
 * @param chainId chainId of the blockchain
 * @param account account address from sender
 * @param contract ApeSwap Router contract
 * @param onBestRoute Callback function to set the best route
 * @param onSetSwapDelay Callback function to set the swap delay state
 */
export default function callWallchainAPI(
  methodName: ALLOWED_BONUS_ROUTER_FUNCTIONS_TYPE,
  args: (string | string[])[],
  value: string,
  chainId: number,
  account: string,
  contract: Contract,
  onBestRoute: (bestRoute: RouterTypeParams) => void,
  onSetSwapDelay: (swapDelay: SwapDelay) => void,
): Promise<any> {
  onSetSwapDelay(SwapDelay.LOADING_ROUTE)
  const encodedData = contract.interface.encodeFunctionData(methodName, args)
  // Allowing transactions to be checked even if no user is connected
  const activeAccount = account || '0x0000000000000000000000000000000000000000'

  // If the initial call fails APE router will be the default router
  return fetch(`${WALLCHAIN_PARAMS[chainId].apiUrl}?key=${WALLCHAIN_PARAMS[chainId].apiKey}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      value,
      sender: activeAccount,
      data: encodedData,
      destination: contract.address,
    }),
  })
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      console.error('Wallchain Error', response.status, response.statusText)
      onBestRoute({ routerType: RouterTypes.APE })
      onSetSwapDelay(SwapDelay.VALID)
      return null
    })
    .then((responseJson) => {
      if (responseJson) {
        const dataResponse: WallchainDataResponse = responseJson
        if (wallchainResponseIsValid(dataResponse, chainId, methodName, args, value, account, contract.address)) {
          onBestRoute({ routerType: RouterTypes.BONUS, bonusRouter: dataResponse })
          onSetSwapDelay(SwapDelay.VALID)
        } else {
          onBestRoute({ routerType: RouterTypes.APE })
          onSetSwapDelay(SwapDelay.VALID)
        }
      }
      onSetSwapDelay(SwapDelay.VALID)
      return null
    })
    .catch((error) => {
      onBestRoute({ routerType: RouterTypes.APE })
      onSetSwapDelay(SwapDelay.VALID)
      console.error('Wallchain Error', error)
    })
}

const recordTransactionError = (
  errorMessage: string | string[],
  dataResponse: WallchainDataResponse,
  chainId: number,
) => {
  const errorOutputBody: { input: any } = {
    input: {
      errorMessage,
      firstTokenAddress: dataResponse.summary?.searchSummary?.firstTokenAddress || '',
      expectedProfit: dataResponse.summary?.searchSummary?.expectedProfit || 0,
      expectedUsdProfit: dataResponse.summary?.searchSummary?.expectedUsdProfit || 0,
      firstTokenAmount: dataResponse.summary?.searchSummary?.firstTokenAmount || 0,
      chainId,
      sender: dataResponse.transactionArgs.sender,
    },
  }
  // TODO: Enable strapi logging
  console.dir({ errorOutputBody })
  return undefined

  // TODO: Enable: Can set in central config file
  return fetch('https://apeswap-strapi.herokuapp.com/arb-errors', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(errorOutputBody),
  }).catch((error) => {
    console.error('Wallchain Txn Summary Recording Error', error)
  })
}
